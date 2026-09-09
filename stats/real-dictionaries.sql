-- GENERATED from tou.edu.kz public structure pages - interim until the
-- registrar office answers request D2 (docs/REQUESTS.md). Codes carry the
-- site's component ids (faculty=NN / department=NN) so rows stay traceable
-- to their source. Idempotent: ON CONFLICT (code) DO NOTHING.

BEGIN;

INSERT INTO faculties (code, name_ru, name_kk, name_en) VALUES
    ('FAC91', 'Факультет экономики и права', 'Экономика және құқық факультеті', 'Faculty of Economics and Law'),
    ('FAC92', 'Факультет Архитектуры и строительства', 'Сәулет және құрылыс факультеті', 'Faculty of Architecture and Construction'),
    ('FAC94', 'Факультет гуманитарных и социальных наук', 'Гуманитарлық және әлеуметтік ғылымдар факультеті', 'Faculties of Humanities and Social Sciences'),
    ('FAC95', 'Факультет естественных наук', 'Жаратылыстану ғылымдары факультеті', 'Faculty of Natural Science'),
    ('FAC96', 'Факультет сельскохозяйственных наук', 'Ауыл шаруашылық ғылымдар факультеті', 'Faculty of Agriculture Science'),
    ('FAC97', 'Факультет инженерии', 'Инженерия факультеті', 'Faculty of engineering'),
    ('FAC98', 'Факультет энергетики', 'Энергетика факультеті', 'Faculty of Energetics'),
    ('FAC211', 'Факультет Computer Science', 'Computer Science факультеті', 'Faculty of Computer Science'),
    ('COLLEGE', 'Высший колледж Торайгыров университета', 'Торайғыров университетінің жоғары колледжі', 'Higher College of Toraighyrov University')
ON CONFLICT (code) DO NOTHING;

INSERT INTO departments (faculty_id, code, name_ru, name_kk, name_en)
SELECT f.id, d.code, d.name_ru, d.name_kk, d.name_en
FROM (VALUES
    ('FAC91', 'DEP99', 'Экономика', 'Экономика', 'Economics and Management'),
    ('FAC91', 'DEP100', 'Финансов и учета', 'Қаржы және есеп', 'Finance and Accounting'),
    ('FAC91', 'DEP102', 'Правоведение', 'Құқықтану', 'Jurisprudence'),
    ('FAC92', 'DEP103', 'Архитектура и дизайн', 'БББ Дизайн және сәулет', 'EP Architecture and Design'),
    ('FAC92', 'DEP104', 'Промышленное и гражданское строительство / ОП Транспортное строительство', 'Өнеркәсіптік және азаматтық құрылыс БББ / Көліктік құрылыс БББ', 'EP Industrial and Civil Construction / EP Transport Construction'),
    ('FAC211', 'DEP106', 'Офис образовательных программ "Computer Science"', 'Офис образовательных программ', 'Office of educational programs'),
    ('FAC94', 'DEP109', 'Философия и социальные науки', 'Философия және әлеуметтік ғылымдар', 'Philosophy and Social sciences'),
    ('FAC94', 'DEP110', 'Истории Казахстана', 'Қазақстан тарихы', 'Histories of Kazakhstan'),
    ('FAC94', 'DEP112', 'Иностранная филология', 'Шетел филологиясы', 'Foreign philology'),
    ('FAC94', 'DEP115', 'Филология', 'Филология', 'Philology'),
    ('FAC94', 'DEP116', 'Исполнительское искусство', 'Орындаушылық өнер', 'Performing Art'),
    ('FAC94', 'DEP117', 'Личностного развития и образования', 'Тұлғалық дамыту және білім беру', 'Department of personal development and education'),
    ('FAC94', 'DEP118', 'Физическая культура и спорт', 'Дене шынықтыру және спорт', 'Physical training and sports'),
    ('FAC95', 'DEP120', 'Биология и экология', 'Биология және экология', 'Biology and Ecology'),
    ('FAC95', 'DEP121', 'Химия и химические технологии', 'Химия және химиялық технология', 'Chemistry and chemical technologies'),
    ('FAC95', 'DEP122', 'География и туризм', 'География және туризм', 'Geography and Tourism'),
    ('FAC96', 'DEP123', 'Агротехнология', 'Агротехнология', 'Agrotechnology'),
    ('FAC96', 'DEP124', 'Биотехнология', 'Биотехнология', 'Biotechnology'),
    ('FAC96', 'DEP125', 'Зоотехнология и ветеринария', 'Зоотехнология және ветеринария', 'Zootechnology and veterinary medicine'),
    ('FAC97', 'DEP126', 'Металлургия', 'Металлургия', 'Metallurgy'),
    ('FAC97', 'DEP127', 'Машиностроение и стандартизация', 'Машинажасау және стандарттау', 'Engineering industry and standardization'),
    ('FAC97', 'DEP128', 'Транспортная техника и логистика', 'Көліктік техника және логистика', 'Transport engineering'),
    ('FAC97', 'DEP129', 'Механика и нефтегазовое дело', 'Механика және мұнай газ ісі', 'Mechanics'),
    ('FAC98', 'DEP130', 'Электроэнергетика', 'Электрэнергетика', 'Electric power industry'),
    ('FAC98', 'DEP131', 'Теплоэнергетика', 'Жылуэнергетика', 'Heat and power engineering'),
    ('FAC98', 'DEP132', 'Электротехника и автоматизация', 'Электротехника және автоматтандыру', 'Электротехника и автоматизация'),
    ('FAC94', 'DEP160', 'Трехъязычия', 'Үш тұғырлы тіл', 'Трехъязычия'),
    ('FAC94', 'DEP240', 'Toraighyrov Media Center', 'Toraighyrov Media Center', 'Toraighyrov Media Center'),
    ('FAC211', 'DEP242', 'Физика, математика и приборостроение', 'Физика, математика және аспап жасау', 'Physics, Mathematics and Instrument Engineering'),
    ('FAC94', 'DEP276', 'Журналистика', 'Журналистика', 'Journalism')
) AS d(faculty_code, code, name_ru, name_kk, name_en)
JOIN faculties f ON f.code = d.faculty_code
ON CONFLICT (code) DO NOTHING;

-- Work types (TZ per 4.2; the `other` sentinel already exists - migration 0002)
INSERT INTO work_types (code, name_ru, name_kk, name_en, sort_order) VALUES
    ('course', 'Курсовая работа', 'Курстық жұмыс', 'Course paper', 10),
    ('thesis_bachelor', 'Дипломная работа (ВКР)', 'Дипломдық жұмыс', 'Bachelor thesis', 20),
    ('thesis_master', 'Магистерская диссертация', 'Магистрлік диссертация', 'Master thesis', 30),
    ('thesis_phd', 'Докторская диссертация (PhD)', 'Докторлық диссертация (PhD)', 'PhD thesis', 40),
    ('article', 'Статья ППС', 'ПОҚ мақаласы', 'Faculty article', 50),
    ('research_report', 'Научно-исследовательская работа (НИР)', 'Ғылыми-зерттеу жұмысы', 'Research report', 60),
    ('other', 'Иное', 'Өзге', 'Other', 90)
ON CONFLICT (code) DO NOTHING;

COMMIT;
