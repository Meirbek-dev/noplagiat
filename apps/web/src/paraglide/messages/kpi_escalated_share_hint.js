/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Kpi_Escalated_Share_HintInputs */

const ru_kpi_escalated_share_hint = /** @type {(inputs: Kpi_Escalated_Share_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`От числа проверок за период`)
};

const kk_kpi_escalated_share_hint = /** @type {(inputs: Kpi_Escalated_Share_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кезеңдегі тексерулер санынан`)
};

const en_kpi_escalated_share_hint = /** @type {(inputs: Kpi_Escalated_Share_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Of the period's checks`)
};

/**
* | output |
* | --- |
* | "Of the period's checks" |
*
* @param {Kpi_Escalated_Share_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_escalated_share_hint = /** @type {((inputs?: Kpi_Escalated_Share_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Escalated_Share_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_kpi_escalated_share_hint(inputs)
	if (locale === "en") return en_kpi_escalated_share_hint(inputs)
	return ru_kpi_escalated_share_hint(inputs)
});