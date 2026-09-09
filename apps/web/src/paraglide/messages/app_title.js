/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} App_TitleInputs */

const ru_app_title = /** @type {(inputs: App_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Дашборд антиплагиата`)
};

const kk_app_title = /** @type {(inputs: App_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Антиплагиат дашборды`)
};

const en_app_title = /** @type {(inputs: App_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Antiplagiarism Dashboard`)
};

/**
* | output |
* | --- |
* | "Antiplagiarism Dashboard" |
*
* @param {App_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const app_title = /** @type {((inputs?: App_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_app_title(inputs)
	if (locale === "en") return en_app_title(inputs)
	return ru_app_title(inputs)
});