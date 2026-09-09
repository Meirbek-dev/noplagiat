/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Audit_IpInputs */

const ru_audit_ip = /** @type {(inputs: Audit_IpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`IP-адрес`)
};

const kk_audit_ip = /** @type {(inputs: Audit_IpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`IP-мекенжай`)
};

const en_audit_ip = /** @type {(inputs: Audit_IpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`IP address`)
};

/**
* | output |
* | --- |
* | "IP address" |
*
* @param {Audit_IpInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_ip = /** @type {((inputs?: Audit_IpInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_IpInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_audit_ip(inputs)
	if (locale === "en") return en_audit_ip(inputs)
	return ru_audit_ip(inputs)
});