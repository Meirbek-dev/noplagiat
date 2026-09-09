/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Audit_Action_ViewInputs */

const ru_audit_action_view = /** @type {(inputs: Audit_Action_ViewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Просмотр`)
};

const kk_audit_action_view = /** @type {(inputs: Audit_Action_ViewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қарау`)
};

const en_audit_action_view = /** @type {(inputs: Audit_Action_ViewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`View`)
};

/**
* | output |
* | --- |
* | "View" |
*
* @param {Audit_Action_ViewInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_action_view = /** @type {((inputs?: Audit_Action_ViewInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_Action_ViewInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_audit_action_view(inputs)
	if (locale === "en") return en_audit_action_view(inputs)
	return ru_audit_action_view(inputs)
});