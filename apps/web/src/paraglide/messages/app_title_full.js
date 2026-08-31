/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} App_Title_FullInputs */

const ru_app_title_full = /** @type {(inputs: App_Title_FullInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Дашборд антиплагиата - Toraighyrov University`)
};

const kk_app_title_full = /** @type {(inputs: App_Title_FullInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Антиплагиат дашборды - Toraighyrov University`)
};

const en_app_title_full = /** @type {(inputs: App_Title_FullInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Antiplagiarism Dashboard - Toraighyrov University`)
};

/**
* | output |
* | --- |
* | "Antiplagiarism Dashboard - Toraighyrov University" |
*
* @param {App_Title_FullInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const app_title_full = /** @type {((inputs?: App_Title_FullInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Title_FullInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_app_title_full(inputs)
	if (locale === "en") return en_app_title_full(inputs)
	return ru_app_title_full(inputs)
});