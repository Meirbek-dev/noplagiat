/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ id: NonNullable<unknown> }} Batch_Errors_TitleInputs */

const ru_batch_errors_title = /** @type {(inputs: Batch_Errors_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Отклонённые записи загрузки №${i?.id}`)
};

const kk_batch_errors_title = /** @type {(inputs: Batch_Errors_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`№${i?.id} жүктеменің қабылданбаған жазбалары`)
};

const en_batch_errors_title = /** @type {(inputs: Batch_Errors_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Rejected rows of batch #${i?.id}`)
};

/**
* | output |
* | --- |
* | "Rejected rows of batch #{id}" |
*
* @param {Batch_Errors_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batch_errors_title = /** @type {((inputs: Batch_Errors_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batch_Errors_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_batch_errors_title(inputs)
	if (locale === "en") return en_batch_errors_title(inputs)
	return ru_batch_errors_title(inputs)
});