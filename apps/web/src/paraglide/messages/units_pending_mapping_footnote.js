/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Units_Pending_Mapping_FootnoteInputs */

const ru_units_pending_mapping_footnote = /** @type {(inputs: Units_Pending_Mapping_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Разбивка по подразделениям станет доступна после загрузки сопоставления проверяющих и подразделений.`)
};

const kk_units_pending_mapping_footnote = /** @type {(inputs: Units_Pending_Mapping_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөлімшелер бойынша бөлініс тексерушілер мен бөлімшелердің сәйкестігі жүктелгеннен кейін қолжетімді болады.`)
};

const en_units_pending_mapping_footnote = /** @type {(inputs: Units_Pending_Mapping_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The breakdown by unit becomes available once the mapping of reviewers to units has been loaded.`)
};

/**
* | output |
* | --- |
* | "The breakdown by unit becomes available once the mapping of reviewers to units has been loaded." |
*
* @param {Units_Pending_Mapping_FootnoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const units_pending_mapping_footnote = /** @type {((inputs?: Units_Pending_Mapping_FootnoteInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Units_Pending_Mapping_FootnoteInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_units_pending_mapping_footnote(inputs)
	if (locale === "en") return en_units_pending_mapping_footnote(inputs)
	return ru_units_pending_mapping_footnote(inputs)
});