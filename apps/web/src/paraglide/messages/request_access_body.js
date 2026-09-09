/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Request_Access_BodyInputs */

const ru_request_access_body = /** @type {(inputs: Request_Access_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Вы вошли в систему, но у вашей учётной записи нет прав на внутренний контур. Доступ выдаётся по заявке руководителя подразделения, согласованной с администратором системы.`)
};

const kk_request_access_body = /** @type {(inputs: Request_Access_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сіз жүйеге кірдіңіз, бірақ тіркелгіңізде ішкі контурға құқық жоқ. Қолжетімділік бөлімше басшысының өтініші бойынша, жүйе әкімшісімен келісіліп беріледі.`)
};

const en_request_access_body = /** @type {(inputs: Request_Access_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`You are signed in, but your account has no rights to the internal contour. Access is granted on a request from the head of your unit, agreed with the system administrator.`)
};

/**
* | output |
* | --- |
* | "You are signed in, but your account has no rights to the internal contour. Access is granted on a request from the head of your unit, agreed with the system ..." |
*
* @param {Request_Access_BodyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_body = /** @type {((inputs?: Request_Access_BodyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Request_Access_BodyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_request_access_body(inputs)
	if (locale === "en") return en_request_access_body(inputs)
	return ru_request_access_body(inputs)
});