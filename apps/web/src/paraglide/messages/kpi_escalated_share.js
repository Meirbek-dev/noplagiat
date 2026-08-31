/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Kpi_Escalated_ShareInputs */

const ru_kpi_escalated_share = /** @type {(inputs: Kpi_Escalated_ShareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Доля эскалаций`)
};

const kk_kpi_escalated_share = /** @type {(inputs: Kpi_Escalated_ShareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Эскалация үлесі`)
};

const en_kpi_escalated_share = /** @type {(inputs: Kpi_Escalated_ShareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escalation share`)
};

/**
* | output |
* | --- |
* | "Escalation share" |
*
* @param {Kpi_Escalated_ShareInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_escalated_share = /** @type {((inputs?: Kpi_Escalated_ShareInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Escalated_ShareInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_kpi_escalated_share(inputs)
	if (locale === "en") return en_kpi_escalated_share(inputs)
	return ru_kpi_escalated_share(inputs)
});