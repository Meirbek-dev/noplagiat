/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ hours: NonNullable<unknown> }} Admin_Batch_StaleInputs */

const ru_admin_batch_stale = /** @type {(inputs: Admin_Batch_StaleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Данные не обновлялись ${i?.hours} ч`)
};

const kk_admin_batch_stale = /** @type {(inputs: Admin_Batch_StaleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Деректер ${i?.hours} сағат жаңартылмаған`)
};

const en_admin_batch_stale = /** @type {(inputs: Admin_Batch_StaleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`No refresh for ${i?.hours} h`)
};

/**
* | output |
* | --- |
* | "No refresh for {hours} h" |
*
* @param {Admin_Batch_StaleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_batch_stale = /** @type {((inputs: Admin_Batch_StaleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Batch_StaleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_admin_batch_stale(inputs)
	if (locale === "en") return en_admin_batch_stale(inputs)
	return ru_admin_batch_stale(inputs)
});