/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Kpi_Escalated_HintInputs */

const ru_kpi_escalated_hint = /** @type {(inputs: Kpi_Escalated_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Подозрительные работы, отметка по которым не снята`)
};

const kk_kpi_escalated_hint = /** @type {(inputs: Kpi_Escalated_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Белгісі алынбаған күдікті жұмыстар`)
};

const en_kpi_escalated_hint = /** @type {(inputs: Kpi_Escalated_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suspicious works whose flag has not been cleared`)
};

/**
* | output |
* | --- |
* | "Suspicious works whose flag has not been cleared" |
*
* @param {Kpi_Escalated_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_escalated_hint = /** @type {((inputs?: Kpi_Escalated_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Escalated_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_kpi_escalated_hint(inputs)
	if (locale === "en") return en_kpi_escalated_hint(inputs)
	return ru_kpi_escalated_hint(inputs)
});