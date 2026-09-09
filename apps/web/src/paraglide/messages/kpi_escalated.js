/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Kpi_EscalatedInputs */

const ru_kpi_escalated = /** @type {(inputs: Kpi_EscalatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Эскалации`)
};

const kk_kpi_escalated = /** @type {(inputs: Kpi_EscalatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Эскалациялар`)
};

const en_kpi_escalated = /** @type {(inputs: Kpi_EscalatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escalations`)
};

/**
* | output |
* | --- |
* | "Escalations" |
*
* @param {Kpi_EscalatedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_escalated = /** @type {((inputs?: Kpi_EscalatedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_EscalatedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_kpi_escalated(inputs)
	if (locale === "en") return en_kpi_escalated(inputs)
	return ru_kpi_escalated(inputs)
});