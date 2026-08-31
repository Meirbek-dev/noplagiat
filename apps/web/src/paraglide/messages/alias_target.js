/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Alias_TargetInputs */

const ru_alias_target = /** @type {(inputs: Alias_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Запись справочника`)
};

const kk_alias_target = /** @type {(inputs: Alias_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Анықтамалық жазбасы`)
};

const en_alias_target = /** @type {(inputs: Alias_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dictionary entry`)
};

/**
* | output |
* | --- |
* | "Dictionary entry" |
*
* @param {Alias_TargetInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const alias_target = /** @type {((inputs?: Alias_TargetInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Alias_TargetInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_alias_target(inputs)
	if (locale === "en") return en_alias_target(inputs)
	return ru_alias_target(inputs)
});