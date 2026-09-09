/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Dict_Code_HintInputs */

const ru_dict_code_hint = /** @type {(inputs: Dict_Code_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Уникальный код записи справочника.`)
};

const kk_dict_code_hint = /** @type {(inputs: Dict_Code_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Анықтамалық жазбасының бірегей коды.`)
};

const en_dict_code_hint = /** @type {(inputs: Dict_Code_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unique code of the dictionary entry.`)
};

/**
* | output |
* | --- |
* | "Unique code of the dictionary entry." |
*
* @param {Dict_Code_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const dict_code_hint = /** @type {((inputs?: Dict_Code_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dict_Code_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_dict_code_hint(inputs)
	if (locale === "en") return en_dict_code_hint(inputs)
	return ru_dict_code_hint(inputs)
});