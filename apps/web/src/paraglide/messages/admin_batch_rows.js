/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ read: NonNullable<unknown>, upserted: NonNullable<unknown>, rejected: NonNullable<unknown> }} Admin_Batch_RowsInputs */

const ru_admin_batch_rows = /** @type {(inputs: Admin_Batch_RowsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Прочитано: ${i?.read} · записано: ${i?.upserted} · отклонено: ${i?.rejected}`)
};

const kk_admin_batch_rows = /** @type {(inputs: Admin_Batch_RowsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Оқылды: ${i?.read} · жазылды: ${i?.upserted} · қабылданбады: ${i?.rejected}`)
};

const en_admin_batch_rows = /** @type {(inputs: Admin_Batch_RowsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Read: ${i?.read} · upserted: ${i?.upserted} · rejected: ${i?.rejected}`)
};

/**
* | output |
* | --- |
* | "Read: {read} · upserted: {upserted} · rejected: {rejected}" |
*
* @param {Admin_Batch_RowsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_batch_rows = /** @type {((inputs: Admin_Batch_RowsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Batch_RowsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_admin_batch_rows(inputs)
	if (locale === "en") return en_admin_batch_rows(inputs)
	return ru_admin_batch_rows(inputs)
});