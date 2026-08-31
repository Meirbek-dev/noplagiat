/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Roles_Grant_SubmitInputs */

const ru_roles_grant_submit = /** @type {(inputs: Roles_Grant_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Выдать`)
};

const kk_roles_grant_submit = /** @type {(inputs: Roles_Grant_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Беру`)
};

const en_roles_grant_submit = /** @type {(inputs: Roles_Grant_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Grant`)
};

/**
* | output |
* | --- |
* | "Grant" |
*
* @param {Roles_Grant_SubmitInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_grant_submit = /** @type {((inputs?: Roles_Grant_SubmitInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_Grant_SubmitInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_roles_grant_submit(inputs)
	if (locale === "en") return en_roles_grant_submit(inputs)
	return ru_roles_grant_submit(inputs)
});