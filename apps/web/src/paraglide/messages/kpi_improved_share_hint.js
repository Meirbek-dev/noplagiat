/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Kpi_Improved_Share_HintInputs */

const ru_kpi_improved_share_hint = /** @type {(inputs: Kpi_Improved_Share_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Работ с улучшением: ${i?.count}`)
};

const kk_kpi_improved_share_hint = /** @type {(inputs: Kpi_Improved_Share_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Жақсарған жұмыстар: ${i?.count}`)
};

const en_kpi_improved_share_hint = /** @type {(inputs: Kpi_Improved_Share_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Works improved: ${i?.count}`)
};

/**
* | output |
* | --- |
* | "Works improved: {count}" |
*
* @param {Kpi_Improved_Share_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_improved_share_hint = /** @type {((inputs: Kpi_Improved_Share_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Improved_Share_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_kpi_improved_share_hint(inputs)
	if (locale === "en") return en_kpi_improved_share_hint(inputs)
	return ru_kpi_improved_share_hint(inputs)
});