/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Audit_Action_Export_PdfInputs */

const ru_audit_action_export_pdf = /** @type {(inputs: Audit_Action_Export_PdfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Экспорт PDF`)
};

const kk_audit_action_export_pdf = /** @type {(inputs: Audit_Action_Export_PdfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PDF экспорты`)
};

const en_audit_action_export_pdf = /** @type {(inputs: Audit_Action_Export_PdfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PDF export`)
};

/**
* | output |
* | --- |
* | "PDF export" |
*
* @param {Audit_Action_Export_PdfInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_action_export_pdf = /** @type {((inputs?: Audit_Action_Export_PdfInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_Action_Export_PdfInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_audit_action_export_pdf(inputs)
	if (locale === "en") return en_audit_action_export_pdf(inputs)
	return ru_audit_action_export_pdf(inputs)
});