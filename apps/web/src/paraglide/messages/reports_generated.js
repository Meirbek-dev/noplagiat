/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Reports_GeneratedInputs */

const ru_reports_generated = /** @type {(inputs: Reports_GeneratedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Сформирован ${i?.date}`)
};

const kk_reports_generated = /** @type {(inputs: Reports_GeneratedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.date} жасалды`)
};

const en_reports_generated = /** @type {(inputs: Reports_GeneratedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Generated ${i?.date}`)
};

/**
* | output |
* | --- |
* | "Generated {date}" |
*
* @param {Reports_GeneratedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const reports_generated = /** @type {((inputs: Reports_GeneratedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reports_GeneratedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_reports_generated(inputs)
	if (locale === "en") return en_reports_generated(inputs)
	return ru_reports_generated(inputs)
});