/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Role_DeanInputs */

const ru_role_dean = /** @type {(inputs: Role_DeanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Декан`)
};

const kk_role_dean = /** @type {(inputs: Role_DeanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Декан`)
};

const en_role_dean = /** @type {(inputs: Role_DeanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dean`)
};

/**
* | output |
* | --- |
* | "Dean" |
*
* @param {Role_DeanInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const role_dean = /** @type {((inputs?: Role_DeanInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Role_DeanInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_role_dean(inputs)
	if (locale === "en") return en_role_dean(inputs)
	return ru_role_dean(inputs)
});