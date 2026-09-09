/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Audit_RoleInputs */

const ru_audit_role = /** @type {(inputs: Audit_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Роль`)
};

const kk_audit_role = /** @type {(inputs: Audit_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Рөл`)
};

const en_audit_role = /** @type {(inputs: Audit_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Role`)
};

/**
* | output |
* | --- |
* | "Role" |
*
* @param {Audit_RoleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_role = /** @type {((inputs?: Audit_RoleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_RoleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_audit_role(inputs)
	if (locale === "en") return en_audit_role(inputs)
	return ru_audit_role(inputs)
});