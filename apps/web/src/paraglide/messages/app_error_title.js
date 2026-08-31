/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} App_Error_TitleInputs */

const ru_app_error_title = /** @type {(inputs: App_Error_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Страница не загрузилась`)
};

const kk_app_error_title = /** @type {(inputs: App_Error_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бет жүктелмеді`)
};

const en_app_error_title = /** @type {(inputs: App_Error_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The page could not be loaded`)
};

/**
* | output |
* | --- |
* | "The page could not be loaded" |
*
* @param {App_Error_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const app_error_title = /** @type {((inputs?: App_Error_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Error_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_app_error_title(inputs)
	if (locale === "en") return en_app_error_title(inputs)
	return ru_app_error_title(inputs)
});