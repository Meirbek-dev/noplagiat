/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_Audit_HintInputs */

const ru_admin_audit_hint = /** @type {(inputs: Admin_Audit_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Все обращения к внутреннему контуру: кто, когда, к какому разделу и с какими фильтрами.`)
};

const kk_admin_audit_hint = /** @type {(inputs: Admin_Audit_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ішкі контурға барлық жүгіну: кім, қашан, қай бөлімге және қандай сүзгілермен.`)
};

const en_admin_audit_hint = /** @type {(inputs: Admin_Audit_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every access to the internal contour: who, when, which section, and with which filters.`)
};

/**
* | output |
* | --- |
* | "Every access to the internal contour: who, when, which section, and with which filters." |
*
* @param {Admin_Audit_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_audit_hint = /** @type {((inputs?: Admin_Audit_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Audit_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_admin_audit_hint(inputs)
	if (locale === "en") return en_admin_audit_hint(inputs)
	return ru_admin_audit_hint(inputs)
});