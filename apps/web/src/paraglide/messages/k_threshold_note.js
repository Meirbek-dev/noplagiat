/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ k: NonNullable<unknown> }} K_Threshold_NoteInputs */

const ru_k_threshold_note = /** @type {(inputs: K_Threshold_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Группы меньше ${i?.k} проверок не публикуются - вместо значения выводится «недостаточно данных».`)
};

const kk_k_threshold_note = /** @type {(inputs: K_Threshold_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.k} тексеруден аз топтар жарияланбайды - мәннің орнына «деректер жеткіліксіз» деп көрсетіледі.`)
};

const en_k_threshold_note = /** @type {(inputs: K_Threshold_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Groups smaller than ${i?.k} checks are not published - the value is replaced by «insufficient data».`)
};

/**
* | output |
* | --- |
* | "Groups smaller than {k} checks are not published - the value is replaced by «insufficient data»." |
*
* @param {K_Threshold_NoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const k_threshold_note = /** @type {((inputs: K_Threshold_NoteInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<K_Threshold_NoteInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_k_threshold_note(inputs)
	if (locale === "en") return en_k_threshold_note(inputs)
	return ru_k_threshold_note(inputs)
});