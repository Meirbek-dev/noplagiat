/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Kpi_Recheck_ShareInputs */

const ru_kpi_recheck_share = /** @type {(inputs: Kpi_Recheck_ShareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Доля повторных проверок`)
};

const kk_kpi_recheck_share = /** @type {(inputs: Kpi_Recheck_ShareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қайта тексеру үлесі`)
};

const en_kpi_recheck_share = /** @type {(inputs: Kpi_Recheck_ShareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Recheck share`)
};

/**
* | output |
* | --- |
* | "Recheck share" |
*
* @param {Kpi_Recheck_ShareInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_recheck_share = /** @type {((inputs?: Kpi_Recheck_ShareInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Recheck_ShareInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_kpi_recheck_share(inputs)
	if (locale === "en") return en_kpi_recheck_share(inputs)
	return ru_kpi_recheck_share(inputs)
});