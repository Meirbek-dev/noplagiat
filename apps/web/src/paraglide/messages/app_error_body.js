/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} App_Error_BodyInputs */

const ru_app_error_body = /** @type {(inputs: App_Error_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Попробуйте обновить страницу. Если ошибка повторяется, обратитесь к администратору системы.`)
};

const kk_app_error_body = /** @type {(inputs: App_Error_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бетті жаңартып көріңіз. Қате қайталанса, жүйе әкімшісіне хабарласыңыз.`)
};

const en_app_error_body = /** @type {(inputs: App_Error_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Try reloading the page. If the error persists, contact the system administrator.`)
};

/**
* | output |
* | --- |
* | "Try reloading the page. If the error persists, contact the system administrator." |
*
* @param {App_Error_BodyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const app_error_body = /** @type {((inputs?: App_Error_BodyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Error_BodyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_app_error_body(inputs)
	if (locale === "en") return en_app_error_body(inputs)
	return ru_app_error_body(inputs)
});