/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_Reports_UnpublishedInputs */

const ru_admin_reports_unpublished = /** @type {(inputs: Admin_Reports_UnpublishedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Неопубликованных отчётов`)
};

const kk_admin_reports_unpublished = /** @type {(inputs: Admin_Reports_UnpublishedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жарияланбаған есептер`)
};

const en_admin_reports_unpublished = /** @type {(inputs: Admin_Reports_UnpublishedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unpublished reports`)
};

/**
* | output |
* | --- |
* | "Unpublished reports" |
*
* @param {Admin_Reports_UnpublishedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_reports_unpublished = /** @type {((inputs?: Admin_Reports_UnpublishedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Reports_UnpublishedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_admin_reports_unpublished(inputs)
	if (locale === "en") return en_admin_reports_unpublished(inputs)
	return ru_admin_reports_unpublished(inputs)
});