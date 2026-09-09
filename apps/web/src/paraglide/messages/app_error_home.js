/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} App_Error_HomeInputs */

const ru_app_error_home = /** @type {(inputs: App_Error_HomeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`На главную`)
};

const kk_app_error_home = /** @type {(inputs: App_Error_HomeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Басты бетке`)
};

const en_app_error_home = /** @type {(inputs: App_Error_HomeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Go to the dashboard`)
};

/**
* | output |
* | --- |
* | "Go to the dashboard" |
*
* @param {App_Error_HomeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const app_error_home = /** @type {((inputs?: App_Error_HomeInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Error_HomeInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_app_error_home(inputs)
	if (locale === "en") return en_app_error_home(inputs)
	return ru_app_error_home(inputs)
});