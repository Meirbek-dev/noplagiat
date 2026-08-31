/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Kpi_Recheck_Share_HintInputs */

const ru_kpi_recheck_share_hint = /** @type {(inputs: Kpi_Recheck_Share_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`От общего числа работ`)
};

const kk_kpi_recheck_share_hint = /** @type {(inputs: Kpi_Recheck_Share_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жұмыстардың жалпы санынан`)
};

const en_kpi_recheck_share_hint = /** @type {(inputs: Kpi_Recheck_Share_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Of all works`)
};

/**
* | output |
* | --- |
* | "Of all works" |
*
* @param {Kpi_Recheck_Share_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_recheck_share_hint = /** @type {((inputs?: Kpi_Recheck_Share_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Recheck_Share_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_kpi_recheck_share_hint(inputs)
	if (locale === "en") return en_kpi_recheck_share_hint(inputs)
	return ru_kpi_recheck_share_hint(inputs)
});