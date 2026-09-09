/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Batch_Errors_HideInputs */

const ru_batch_errors_hide = /** @type {(inputs: Batch_Errors_HideInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Скрыть ошибки`)
};

const kk_batch_errors_hide = /** @type {(inputs: Batch_Errors_HideInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қателерді жасыру`)
};

const en_batch_errors_hide = /** @type {(inputs: Batch_Errors_HideInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hide errors`)
};

/**
* | output |
* | --- |
* | "Hide errors" |
*
* @param {Batch_Errors_HideInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_errors_hide = /** @type {((inputs?: Batch_Errors_HideInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_Errors_HideInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_batch_errors_hide(inputs)
	if (locale === "en") return en_batch_errors_hide(inputs)
	return ru_batch_errors_hide(inputs)
});