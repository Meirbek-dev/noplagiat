/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Role_EthicsInputs */

const ru_role_ethics = /** @type {(inputs: Role_EthicsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Уполномоченный по этике`)
};

const kk_role_ethics = /** @type {(inputs: Role_EthicsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Этика жөніндегі уәкіл`)
};

const en_role_ethics = /** @type {(inputs: Role_EthicsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ethics officer`)
};

/**
* | output |
* | --- |
* | "Ethics officer" |
*
* @param {Role_EthicsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const role_ethics = /** @type {((inputs?: Role_EthicsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Role_EthicsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_role_ethics(inputs)
	if (locale === "en") return en_role_ethics(inputs)
	return ru_role_ethics(inputs)
});