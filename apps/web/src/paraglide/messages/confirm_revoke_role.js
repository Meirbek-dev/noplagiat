/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Confirm_Revoke_RoleInputs */

const ru_confirm_revoke_role = /** @type {(inputs: Confirm_Revoke_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Отозвать эту роль у учётной записи?`)
};

const kk_confirm_revoke_role = /** @type {(inputs: Confirm_Revoke_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Осы рөлді тіркелгіден алып тастау керек пе?`)
};

const en_confirm_revoke_role = /** @type {(inputs: Confirm_Revoke_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revoke this role from the account?`)
};

/**
* | output |
* | --- |
* | "Revoke this role from the account?" |
*
* @param {Confirm_Revoke_RoleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const confirm_revoke_role = /** @type {((inputs?: Confirm_Revoke_RoleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Confirm_Revoke_RoleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_confirm_revoke_role(inputs)
	if (locale === "en") return en_confirm_revoke_role(inputs)
	return ru_confirm_revoke_role(inputs)
});