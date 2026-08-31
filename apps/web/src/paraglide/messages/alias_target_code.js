/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Alias_Target_CodeInputs */

const ru_alias_target_code = /** @type {(inputs: Alias_Target_CodeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Код назначения`)
};

const kk_alias_target_code = /** @type {(inputs: Alias_Target_CodeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Мақсат коды`)
};

const en_alias_target_code = /** @type {(inputs: Alias_Target_CodeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Target code`)
};

/**
* | output |
* | --- |
* | "Target code" |
*
* @param {Alias_Target_CodeInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const alias_target_code = /** @type {((inputs?: Alias_Target_CodeInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Alias_Target_CodeInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_alias_target_code(inputs)
	if (locale === "en") return en_alias_target_code(inputs)
	return ru_alias_target_code(inputs)
});