/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Updated_By_SystemInputs */

const ru_settings_updated_by_system = /** @type {(inputs: Settings_Updated_By_SystemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`системой`)
};

const kk_settings_updated_by_system = /** @type {(inputs: Settings_Updated_By_SystemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`жүйе`)
};

const en_settings_updated_by_system = /** @type {(inputs: Settings_Updated_By_SystemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`the system`)
};

/**
* | output |
* | --- |
* | "the system" |
*
* @param {Settings_Updated_By_SystemInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const settings_updated_by_system = /** @type {((inputs?: Settings_Updated_By_SystemInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Updated_By_SystemInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_settings_updated_by_system(inputs)
	if (locale === "en") return en_settings_updated_by_system(inputs)
	return ru_settings_updated_by_system(inputs)
});