/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Audit_SectionInputs */

const ru_audit_section = /** @type {(inputs: Audit_SectionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Раздел`)
};

const kk_audit_section = /** @type {(inputs: Audit_SectionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөлім`)
};

const en_audit_section = /** @type {(inputs: Audit_SectionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Section`)
};

/**
* | output |
* | --- |
* | "Section" |
*
* @param {Audit_SectionInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_section = /** @type {((inputs?: Audit_SectionInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_SectionInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_audit_section(inputs)
	if (locale === "en") return en_audit_section(inputs)
	return ru_audit_section(inputs)
});