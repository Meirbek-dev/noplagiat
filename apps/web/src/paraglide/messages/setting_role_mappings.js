/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Setting_Role_MappingsInputs */

const ru_setting_role_mappings = /** @type {(inputs: Setting_Role_MappingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сопоставление групп единого входа`)
};

const kk_setting_role_mappings = /** @type {(inputs: Setting_Role_MappingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бірыңғай кіру топтарының сәйкестігі`)
};

const en_setting_role_mappings = /** @type {(inputs: Setting_Role_MappingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`SSO group mappings`)
};

/**
* | output |
* | --- |
* | "SSO group mappings" |
*
* @param {Setting_Role_MappingsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_role_mappings = /** @type {((inputs?: Setting_Role_MappingsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Role_MappingsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_setting_role_mappings(inputs)
	if (locale === "en") return en_setting_role_mappings(inputs)
	return ru_setting_role_mappings(inputs)
});