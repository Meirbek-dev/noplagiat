/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Work_Type_Rules_TitleInputs */

const ru_work_type_rules_title = /** @type {(inputs: Work_Type_Rules_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Правила определения типа работы`)
};

const kk_work_type_rules_title = /** @type {(inputs: Work_Type_Rules_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жұмыс түрін анықтау ережелері`)
};

const en_work_type_rules_title = /** @type {(inputs: Work_Type_Rules_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Work-type rules`)
};

/**
* | output |
* | --- |
* | "Work-type rules" |
*
* @param {Work_Type_Rules_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const work_type_rules_title = /** @type {((inputs?: Work_Type_Rules_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Work_Type_Rules_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_work_type_rules_title(inputs)
	if (locale === "en") return en_work_type_rules_title(inputs)
	return ru_work_type_rules_title(inputs)
});