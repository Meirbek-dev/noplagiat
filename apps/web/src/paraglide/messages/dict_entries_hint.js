/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Dict_Entries_HintInputs */

const ru_dict_entries_hint = /** @type {(inputs: Dict_Entries_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Добавление с существующим кодом заменяет запись.`)
};

const kk_dict_entries_hint = /** @type {(inputs: Dict_Entries_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бар кодпен қосу жазбаны ауыстырады.`)
};

const en_dict_entries_hint = /** @type {(inputs: Dict_Entries_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Adding an existing code replaces the entry.`)
};

/**
* | output |
* | --- |
* | "Adding an existing code replaces the entry." |
*
* @param {Dict_Entries_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_entries_hint = /** @type {((inputs?: Dict_Entries_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Entries_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_dict_entries_hint(inputs)
	if (locale === "en") return en_dict_entries_hint(inputs)
	return ru_dict_entries_hint(inputs)
});