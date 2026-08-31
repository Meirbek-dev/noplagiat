/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Batch_Errors_ShowInputs */

const ru_batch_errors_show = /** @type {(inputs: Batch_Errors_ShowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ошибки`)
};

const kk_batch_errors_show = /** @type {(inputs: Batch_Errors_ShowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қателер`)
};

const en_batch_errors_show = /** @type {(inputs: Batch_Errors_ShowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Errors`)
};

/**
* | output |
* | --- |
* | "Errors" |
*
* @param {Batch_Errors_ShowInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_errors_show = /** @type {((inputs?: Batch_Errors_ShowInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_Errors_ShowInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_batch_errors_show(inputs)
	if (locale === "en") return en_batch_errors_show(inputs)
	return ru_batch_errors_show(inputs)
});