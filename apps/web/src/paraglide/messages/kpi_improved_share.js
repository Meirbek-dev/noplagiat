/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Kpi_Improved_ShareInputs */

const ru_kpi_improved_share = /** @type {(inputs: Kpi_Improved_ShareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Доля с улучшением`)
};

const kk_kpi_improved_share = /** @type {(inputs: Kpi_Improved_ShareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жақсару үлесі`)
};

const en_kpi_improved_share = /** @type {(inputs: Kpi_Improved_ShareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Improved share`)
};

/**
* | output |
* | --- |
* | "Improved share" |
*
* @param {Kpi_Improved_ShareInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_improved_share = /** @type {((inputs?: Kpi_Improved_ShareInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Improved_ShareInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_kpi_improved_share(inputs)
	if (locale === "en") return en_kpi_improved_share(inputs)
	return ru_kpi_improved_share(inputs)
});