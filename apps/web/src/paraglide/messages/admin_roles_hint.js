/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_Roles_HintInputs */

const ru_admin_roles_hint = /** @type {(inputs: Admin_Roles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Учётные записи и выданные им роли с областями видимости.`)
};

const kk_admin_roles_hint = /** @type {(inputs: Admin_Roles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тіркелгілер және оларға берілген рөлдер мен көріну аймақтары.`)
};

const en_admin_roles_hint = /** @type {(inputs: Admin_Roles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Accounts and the roles and scopes granted to them.`)
};

/**
* | output |
* | --- |
* | "Accounts and the roles and scopes granted to them." |
*
* @param {Admin_Roles_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_roles_hint = /** @type {((inputs?: Admin_Roles_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Roles_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_admin_roles_hint(inputs)
	if (locale === "en") return en_admin_roles_hint(inputs)
	return ru_admin_roles_hint(inputs)
});