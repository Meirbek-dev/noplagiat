/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Audit_AnyInputs */

const ru_audit_any = /** @type {(inputs: Audit_AnyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Любое`)
};

const kk_audit_any = /** @type {(inputs: Audit_AnyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кез келген`)
};

const en_audit_any = /** @type {(inputs: Audit_AnyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Any`)
};

/**
* | output |
* | --- |
* | "Any" |
*
* @param {Audit_AnyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_any = /** @type {((inputs?: Audit_AnyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_AnyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_audit_any(inputs)
	if (locale === "en") return en_audit_any(inputs)
	return ru_audit_any(inputs)
});