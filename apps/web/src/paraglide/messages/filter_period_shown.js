/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ from: NonNullable<unknown>, to: NonNullable<unknown> }} Filter_Period_ShownInputs */

const ru_filter_period_shown = /** @type {(inputs: Filter_Period_ShownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Показан период: ${i?.from} - ${i?.to}`)
};

const kk_filter_period_shown = /** @type {(inputs: Filter_Period_ShownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Көрсетілген кезең: ${i?.from} - ${i?.to}`)
};

const en_filter_period_shown = /** @type {(inputs: Filter_Period_ShownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Showing ${i?.from} - ${i?.to}`)
};

/**
* | output |
* | --- |
* | "Showing {from} - {to}" |
*
* @param {Filter_Period_ShownInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const filter_period_shown = /** @type {((inputs: Filter_Period_ShownInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Period_ShownInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_filter_period_shown(inputs)
	if (locale === "en") return en_filter_period_shown(inputs)
	return ru_filter_period_shown(inputs)
});