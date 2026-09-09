/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Roles_Active_YesInputs */

const ru_roles_active_yes = /** @type {(inputs: Roles_Active_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Активна`)
};

const kk_roles_active_yes = /** @type {(inputs: Roles_Active_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Белсенді`)
};

const en_roles_active_yes = /** @type {(inputs: Roles_Active_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Active`)
};

/**
* | output |
* | --- |
* | "Active" |
*
* @param {Roles_Active_YesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_active_yes = /** @type {((inputs?: Roles_Active_YesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_Active_YesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_roles_active_yes(inputs)
	if (locale === "en") return en_roles_active_yes(inputs)
	return ru_roles_active_yes(inputs)
});