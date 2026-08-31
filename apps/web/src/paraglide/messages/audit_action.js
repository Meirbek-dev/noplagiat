/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Audit_ActionInputs */

const ru_audit_action = /** @type {(inputs: Audit_ActionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Действие`)
};

const kk_audit_action = /** @type {(inputs: Audit_ActionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Әрекет`)
};

const en_audit_action = /** @type {(inputs: Audit_ActionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Action`)
};

/**
* | output |
* | --- |
* | "Action" |
*
* @param {Audit_ActionInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_action = /** @type {((inputs?: Audit_ActionInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_ActionInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_audit_action(inputs)
	if (locale === "en") return en_audit_action(inputs)
	return ru_audit_action(inputs)
});