/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Roles_ActiveInputs */

const ru_roles_active = /** @type {(inputs: Roles_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Состояние`)
};

const kk_roles_active = /** @type {(inputs: Roles_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Күйі`)
};

const en_roles_active = /** @type {(inputs: Roles_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`State`)
};

/**
* | output |
* | --- |
* | "State" |
*
* @param {Roles_ActiveInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_active = /** @type {((inputs?: Roles_ActiveInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_ActiveInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_roles_active(inputs)
	if (locale === "en") return en_roles_active(inputs)
	return ru_roles_active(inputs)
});