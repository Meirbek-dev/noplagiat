/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Rule_Work_TypeInputs */

const ru_rule_work_type = /** @type {(inputs: Rule_Work_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тип работы`)
};

const kk_rule_work_type = /** @type {(inputs: Rule_Work_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жұмыс түрі`)
};

const en_rule_work_type = /** @type {(inputs: Rule_Work_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Work type`)
};

/**
* | output |
* | --- |
* | "Work type" |
*
* @param {Rule_Work_TypeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rule_work_type = /** @type {((inputs?: Rule_Work_TypeInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rule_Work_TypeInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_rule_work_type(inputs)
	if (locale === "en") return en_rule_work_type(inputs)
	return ru_rule_work_type(inputs)
});