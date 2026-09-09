/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Work_Type_Rules_HintInputs */

const ru_work_type_rules_hint = /** @type {(inputs: Work_Type_Rules_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Определяют тип работы по названию документа.`)
};

const kk_work_type_rules_hint = /** @type {(inputs: Work_Type_Rules_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Құжат атауы бойынша жұмыс түрін анықтайды.`)
};

const en_work_type_rules_hint = /** @type {(inputs: Work_Type_Rules_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Derive the work type from the document title.`)
};

/**
* | output |
* | --- |
* | "Derive the work type from the document title." |
*
* @param {Work_Type_Rules_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const work_type_rules_hint = /** @type {((inputs?: Work_Type_Rules_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Work_Type_Rules_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_work_type_rules_hint(inputs)
	if (locale === "en") return en_work_type_rules_hint(inputs)
	return ru_work_type_rules_hint(inputs)
});