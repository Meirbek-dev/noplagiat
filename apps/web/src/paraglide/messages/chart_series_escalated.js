/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Series_EscalatedInputs */

const ru_chart_series_escalated = /** @type {(inputs: Chart_Series_EscalatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Эскалации`)
};

const kk_chart_series_escalated = /** @type {(inputs: Chart_Series_EscalatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Эскалациялар`)
};

const en_chart_series_escalated = /** @type {(inputs: Chart_Series_EscalatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escalations`)
};

/**
* | output |
* | --- |
* | "Escalations" |
*
* @param {Chart_Series_EscalatedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_series_escalated = /** @type {((inputs?: Chart_Series_EscalatedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Series_EscalatedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_series_escalated(inputs)
	if (locale === "en") return en_chart_series_escalated(inputs)
	return ru_chart_series_escalated(inputs)
});