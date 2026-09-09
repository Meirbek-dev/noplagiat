/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Batch_Errors_EmptyInputs */

const ru_batch_errors_empty = /** @type {(inputs: Batch_Errors_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Отклонённых записей нет.`)
};

const kk_batch_errors_empty = /** @type {(inputs: Batch_Errors_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қабылданбаған жазбалар жоқ.`)
};

const en_batch_errors_empty = /** @type {(inputs: Batch_Errors_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No rejected rows.`)
};

/**
* | output |
* | --- |
* | "No rejected rows." |
*
* @param {Batch_Errors_EmptyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_errors_empty = /** @type {((inputs?: Batch_Errors_EmptyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_Errors_EmptyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_batch_errors_empty(inputs)
	if (locale === "en") return en_batch_errors_empty(inputs)
	return ru_batch_errors_empty(inputs)
});