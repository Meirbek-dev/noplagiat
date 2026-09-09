/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown>, total: NonNullable<unknown> }} Chart_Suppressed_NoteInputs */

const ru_chart_suppressed_note = /** @type {(inputs: Chart_Suppressed_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Скрыто значений: ${i?.count} из ${i?.total} - недостаточно данных`)
};

const kk_chart_suppressed_note = /** @type {(inputs: Chart_Suppressed_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Жасырылған мәндер: ${i?.total} ішінен ${i?.count} - деректер жеткіліксіз`)
};

const en_chart_suppressed_note = /** @type {(inputs: Chart_Suppressed_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} of ${i?.total} values are hidden: insufficient data`)
};

/**
* | output |
* | --- |
* | "{count} of {total} values are hidden: insufficient data" |
*
* @param {Chart_Suppressed_NoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_suppressed_note = /** @type {((inputs: Chart_Suppressed_NoteInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Suppressed_NoteInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_suppressed_note(inputs)
	if (locale === "en") return en_chart_suppressed_note(inputs)
	return ru_chart_suppressed_note(inputs)
});