/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Audit_TimeInputs */

const ru_audit_time = /** @type {(inputs: Audit_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Время`)
};

const kk_audit_time = /** @type {(inputs: Audit_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Уақыты`)
};

const en_audit_time = /** @type {(inputs: Audit_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Time`)
};

/**
* | output |
* | --- |
* | "Time" |
*
* @param {Audit_TimeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_time = /** @type {((inputs?: Audit_TimeInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_TimeInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_audit_time(inputs)
	if (locale === "en") return en_audit_time(inputs)
	return ru_audit_time(inputs)
});