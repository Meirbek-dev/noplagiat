# Первичное наполнение production и создание учётных записей

Эта инструкция предназначена для первого наполнения уже развёрнутого production-стека
историческими CSV-выгрузками и для создания локальных учётных записей внутреннего
контура. Все команды выполняет оператор с доступом к production-хосту.

Подробности эксплуатации, резервного копирования и восстановления находятся в
[RUNBOOK.md](RUNBOOK.md). Формат исходных CSV и правила обезличивания зафиксированы в
[ADR-008](../docs/adr/008-legacy-derivation-and-hmac.md), а модель учётных записей — в
[ADR-017](../docs/adr/017-local-accounts.md).

## 1. Подготовка

1. Перейдите на production-хосте в каталог развёртывания, где лежат
   `docker-compose.yml` и `.env`. В стандартном GitLab-развёртывании это каталог вида
   `/docker/projects/noplagiat-prod/`.
2. Убедитесь, что стек запущен и миграции применились:

   ```bash
   docker compose --env-file .env -f docker-compose.yml ps
   docker compose --env-file .env -f docker-compose.yml exec -T server \
     curl --fail --silent http://127.0.0.1:8080/healthz
   ```

3. Сделайте свежую резервную копию production-БД и проверьте её согласно разделу
   «Резервные копии и восстановление» в [RUNBOOK.md](RUNBOOK.md). Импорт идемпотентен,
   но резервная копия обязательна перед изменением production-данных.
4. До production прогоните те же файлы на staging и сверяйте счётчики там. У импорта
   нет отдельной кнопки публикации: каждая успешно завершённая партия сразу обновляет
   агрегаты, а публичный контур увидит их после истечения кеша.
5. Убедитесь, что в `.env` уже задан постоянный production-секрет
   `APP_INGEST_PEPPER`. Не меняйте его между импортами: смена пеппера разорвёт связи
   между попытками одной работы и привязками проверяющих. Не выводите значение в терминал
   и не добавляйте его в профиль оболочки.
6. Подготовьте дерево выгрузки:

   ```text
   stats/
   ├── 2024-2025/
   │   ├── documents.csv
   │   └── system-usage.csv    # необязательно, но нужно для контрольной сверки
   └── 2025-2026/
       ├── documents.csv
       └── system-usage.csv
   ```

   `documents.csv` должен иметь точный заголовок из 14 колонок и диалект, описанный в
   ADR-008 §1. Не открывайте и не пересохраняйте выгрузку в Excel: это может изменить
   BOM, разделитель, кавычки или даты.

## 2. Безопасная передача выгрузки

Создайте на production-хосте каталог с доступом только для оператора. Используйте для
каждой передачи отдельное имя партии:

```bash
sudo install -d -m 0700 /srv/noplagiat/import/2026-09-04
```

Передайте туда содержимое локального `stats/` через утверждённый университетом
защищённый канал, например SFTP или `rsync` по SSH. Не помещайте выгрузку внутрь checkout
репозитория.

После передачи проверьте только структуру и права, не печатая содержимое CSV в лог:

```bash
find /srv/noplagiat/import/2026-09-04 -maxdepth 2 -type f -printf '%P\n'
sudo chmod -R go-rwx /srv/noplagiat/import/2026-09-04
```

## 3. Импорт в production

Создайте временный каталог в контейнере и скопируйте туда выгрузку:

```bash
docker compose --env-file .env -f docker-compose.yml exec -u root -T server \
  sh -c 'install -d -m 0700 -o appuser -g appuser /tmp/noplagiat-import'

docker compose --env-file .env -f docker-compose.yml cp \
  /srv/noplagiat/import/2026-09-04/. server:/tmp/noplagiat-import/

docker compose --env-file .env -f docker-compose.yml exec -u root -T server \
  chown -R appuser:appuser /tmp/noplagiat-import
```

Запустите импорт бинарником из развёрнутого образа. Он уже получает
`APP_DATABASE_URL` и `APP_INGEST_PEPPER` из окружения сервиса:

```bash
docker compose --env-file .env -f docker-compose.yml exec -T server \
  ingest-csv --dir /tmp/noplagiat-import --source csv-backfill-2026-09-04
```

`--dir` принимает либо корень с каталогами `YYYY-YYYY`, либо один каталог учебного
года. Команда возвращает ненулевой код, если хотя бы одна партия завершилась ошибкой.
Повторный запуск после исправления причины безопасен: факты записываются идемпотентно по
идентификатору проверки и номеру попытки. Не исправляйте строки напрямую в production-БД.
Каждый учебный год фиксируется отдельной партией: ошибка позднего года не откатывает уже
успешно импортированные ранние годы, поэтому после отказа обязательно проверьте журнал
партий.

Исторические CSV сами по себе не содержат факультет и кафедру. Пока администратор не
загрузит справочники, привязки `staff_units` и правила типов работ, соответствующие
разрезы попадут в `UNASSIGNED` / `other`. Это ожидаемое ограничение источника, а не сбой
импорта.

## 4. Проверка результата

Проверьте последние партии и количество фактов по учебным годам:

```bash
docker compose --env-file .env -f docker-compose.yml exec -T postgres sh -c \
  'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c \
  "SELECT id, source, status, rows_read, rows_upserted, rows_rejected,
          rows_skipped_deleted, finished_at
     FROM ingest_batches
    ORDER BY id DESC
    LIMIT 20"'

docker compose --env-file .env -f docker-compose.yml exec -T postgres sh -c \
  'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c \
  "SELECT academic_year, count(*) AS checks
     FROM checks
    GROUP BY academic_year
    ORDER BY academic_year"'
```

Для каждой партии должны выполняться условия:

- `status = succeeded`;
- `rows_read = rows_upserted + rows_rejected + rows_skipped_deleted`;
- все отклонения объяснены до публикации данных;
- количество проверок сверено с `system-usage.csv`; допустимое расхождение оформлено
  письменно, а не скрыто изменением исходных значений.

Проверьте приложение через внешний HTTPS-origin. Публичные ответы кешируются до часа,
поэтому сразу после импорта браузер или прокси может кратковременно показывать прежний
пустой ответ. `/healthz` проверяет доступность сервиса, а `/readyz` дополнительно
проверяет свежесть успешного импорта.

Разовый CSV-бэкфилл не заменяет ежедневное обновление. После первой успешной партии
`/readyz` начнёт отвечать `ingest_stale` через 26 часов без нового успешного импорта.
До завершения ввода в эксплуатацию зарегистрируйте включённый API/CSV-источник и
расписание в административном разделе либо оформите отдельную ежедневную операционную
процедуру. Проверьте следующую автоматическую партию в журнале импорта.

После успешной сверки удалите обе сырые копии. Сначала ещё раз проверьте, что указаны
именно временные каталоги этой партии:

```bash
docker compose --env-file .env -f docker-compose.yml exec -u root -T server \
  rm -rf -- /tmp/noplagiat-import
sudo rm -rf -- /srv/noplagiat/import/2026-09-04
```

## 5. Создание первого администратора

Учётные записи создаются только CLI `manage-users` внутри контейнера `server`. Формы
регистрации и HTTP-метода создания аккаунта нет.

Создайте первого администратора интерактивно:

```bash
docker compose --env-file .env -f docker-compose.yml exec server \
  manage-users create-user --username admin --role admin
```

CLI дважды запросит пароль без отображения ввода. Пароль должен содержать от 12 до 256
символов. Не передавайте пароль аргументом командной строки и не записывайте его в `.env`.
После создания войдите через `https://noplagiat.tou.edu.kz/login` и откройте
административный раздел.

## 6. Создание остальных учётных записей

Общеуниверситетские роли не принимают область видимости:

```bash
docker compose --env-file .env -f docker-compose.yml exec server \
  manage-users create-user --username compliance.01 --role compliance

docker compose --env-file .env -f docker-compose.yml exec server \
  manage-users create-user --username ethics.01 --role ethics
```

Роли подразделений требуют существующий код факультета или кафедры. Сначала загрузите
справочники и проверьте коды в административном разделе, затем выполните:

```bash
docker compose --env-file .env -f docker-compose.yml exec server \
  manage-users create-user --username dean.fac03 --role dean --faculty FAC03

docker compose --env-file .env -f docker-compose.yml exec server \
  manage-users create-user --username head.dep11 --role dept_head --department DEP11
```

Роль `staff` не открывает внутренний контур; она оставляет пользователю только публичные
данные. Гранты одной учётной записи аддитивны.

Основные операции сопровождения:

```bash
docker compose --env-file .env -f docker-compose.yml exec -T server manage-users list
docker compose --env-file .env -f docker-compose.yml exec server \
  manage-users set-password --username admin
docker compose --env-file .env -f docker-compose.yml exec -T server \
  manage-users grant --username compliance.01 --role ethics
docker compose --env-file .env -f docker-compose.yml exec -T server \
  manage-users revoke --username compliance.01 --role ethics
docker compose --env-file .env -f docker-compose.yml exec -T server \
  manage-users deactivate --username compliance.01
docker compose --env-file .env -f docker-compose.yml exec -T server \
  manage-users activate --username compliance.01
```

`create-user` не является upsert: для существующего логина команда завершится ошибкой.
Используйте `set-password`, `grant` и `revoke`. Смена пароля и деактивация немедленно
завершают все активные сеансы этой учётной записи.

## 7. Финальная проверка

Перед завершением работ убедитесь, что:

- `manage-users list` показывает только ожидаемые активные записи и области видимости;
- администратор входит по HTTPS, а декан и заведующий видят только своё подразделение;
- `/readyz` отвечает `200` после успешного импорта;
- настроено ежедневное обновление, и следующая автоматическая партия завершилась успешно;
- в checkout, истории Git, CI artifacts и образах нет `stats/`, `.env`, дампов,
  отчётов и секретов;
- временные сырые CSV удалены с хоста и из контейнера после утверждённой сверки.
