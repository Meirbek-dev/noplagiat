/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Audit_Action_Export_XlsxInputs */

const ru_audit_action_export_xlsx = /** @type {(inputs: Audit_Action_Export_XlsxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Экспорт Excel`)
};

const kk_audit_action_export_xlsx = /** @type {(inputs: Audit_Action_Export_XlsxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Excel экспорты`)
};

const en_audit_action_export_xlsx = /** @type {(inputs: Audit_Action_Export_XlsxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Excel export`)
};

/**
* | output |
* | --- |
* | "Excel export" |
*
* @param {Audit_Action_Export_XlsxInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_action_export_xlsx = /** @type {((inputs?: Audit_Action_Export_XlsxInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_Action_Export_XlsxInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_audit_action_export_xlsx(inputs)
	if (locale === "en") return en_audit_action_export_xlsx(inputs)
	return ru_audit_action_export_xlsx(inputs)
});