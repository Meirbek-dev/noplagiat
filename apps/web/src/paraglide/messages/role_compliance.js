/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Role_ComplianceInputs */

const ru_role_compliance = /** @type {(inputs: Role_ComplianceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Комплаенс-служба`)
};

const kk_role_compliance = /** @type {(inputs: Role_ComplianceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Комплаенс қызметі`)
};

const en_role_compliance = /** @type {(inputs: Role_ComplianceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Compliance office`)
};

/**
* | output |
* | --- |
* | "Compliance office" |
*
* @param {Role_ComplianceInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const role_compliance = /** @type {((inputs?: Role_ComplianceInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Role_ComplianceInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_role_compliance(inputs)
	if (locale === "en") return en_role_compliance(inputs)
	return ru_role_compliance(inputs)
});