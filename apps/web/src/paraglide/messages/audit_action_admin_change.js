/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Audit_Action_Admin_ChangeInputs */

const ru_audit_action_admin_change = /** @type {(inputs: Audit_Action_Admin_ChangeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Изменение настроек`)
};

const kk_audit_action_admin_change = /** @type {(inputs: Audit_Action_Admin_ChangeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Баптауларды өзгерту`)
};

const en_audit_action_admin_change = /** @type {(inputs: Audit_Action_Admin_ChangeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Admin change`)
};

/**
* | output |
* | --- |
* | "Admin change" |
*
* @param {Audit_Action_Admin_ChangeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_action_admin_change = /** @type {((inputs?: Audit_Action_Admin_ChangeInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_Action_Admin_ChangeInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_audit_action_admin_change(inputs)
	if (locale === "en") return en_audit_action_admin_change(inputs)
	return ru_audit_action_admin_change(inputs)
});