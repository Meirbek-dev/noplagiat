/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aliases_TitleInputs */

const ru_aliases_title = /** @type {(inputs: Aliases_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сопоставления наименований`)
};

const kk_aliases_title = /** @type {(inputs: Aliases_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Атаулар сәйкестігі`)
};

const en_aliases_title = /** @type {(inputs: Aliases_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Label aliases`)
};

/**
* | output |
* | --- |
* | "Label aliases" |
*
* @param {Aliases_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const aliases_title = /** @type {((inputs?: Aliases_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aliases_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_aliases_title(inputs)
	if (locale === "en") return en_aliases_title(inputs)
	return ru_aliases_title(inputs)
});