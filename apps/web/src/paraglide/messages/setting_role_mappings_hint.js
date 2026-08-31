/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Setting_Role_Mappings_HintInputs */

const ru_setting_role_mappings_hint = /** @type {(inputs: Setting_Role_Mappings_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Массив объектов: group, role и, при необходимости, faculty_code или department_code.`)
};

const kk_setting_role_mappings_hint = /** @type {(inputs: Setting_Role_Mappings_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Нысандар жиымы: group, role және қажет болса faculty_code немесе department_code.`)
};

const en_setting_role_mappings_hint = /** @type {(inputs: Setting_Role_Mappings_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`An array of objects: group, role and, where needed, faculty_code or department_code.`)
};

/**
* | output |
* | --- |
* | "An array of objects: group, role and, where needed, faculty_code or department_code." |
*
* @param {Setting_Role_Mappings_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_role_mappings_hint = /** @type {((inputs?: Setting_Role_Mappings_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Role_Mappings_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_setting_role_mappings_hint(inputs)
	if (locale === "en") return en_setting_role_mappings_hint(inputs)
	return ru_setting_role_mappings_hint(inputs)
});