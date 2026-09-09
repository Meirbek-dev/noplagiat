/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_AuditInputs */

const ru_admin_audit = /** @type {(inputs: Admin_AuditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Журнал доступа`)
};

const kk_admin_audit = /** @type {(inputs: Admin_AuditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қатынау журналы`)
};

const en_admin_audit = /** @type {(inputs: Admin_AuditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Access log`)
};

/**
* | output |
* | --- |
* | "Access log" |
*
* @param {Admin_AuditInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_audit = /** @type {((inputs?: Admin_AuditInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_AuditInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_admin_audit(inputs)
	if (locale === "en") return en_admin_audit(inputs)
	return ru_admin_audit(inputs)
});