/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Dict_EntriesInputs */

const ru_dict_entries = /** @type {(inputs: Dict_EntriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Записи справочника`)
};

const kk_dict_entries = /** @type {(inputs: Dict_EntriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Анықтамалық жазбалары`)
};

const en_dict_entries = /** @type {(inputs: Dict_EntriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dictionary entries`)
};

/**
* | output |
* | --- |
* | "Dictionary entries" |
*
* @param {Dict_EntriesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_entries = /** @type {((inputs?: Dict_EntriesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_EntriesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_dict_entries(inputs)
	if (locale === "en") return en_dict_entries(inputs)
	return ru_dict_entries(inputs)
});