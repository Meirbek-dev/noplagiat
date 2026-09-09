/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_Error_TitleInputs */

const ru_section_error_title = /** @type {(inputs: Section_Error_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Не удалось загрузить раздел`)
};

const kk_section_error_title = /** @type {(inputs: Section_Error_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөлімді жүктеу мүмкін болмады`)
};

const en_section_error_title = /** @type {(inputs: Section_Error_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This section could not be loaded`)
};

/**
* | output |
* | --- |
* | "This section could not be loaded" |
*
* @param {Section_Error_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_error_title = /** @type {((inputs?: Section_Error_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Error_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_error_title(inputs)
	if (locale === "en") return en_section_error_title(inputs)
	return ru_section_error_title(inputs)
});