/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_ReportsInputs */

const ru_admin_reports = /** @type {(inputs: Admin_ReportsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Отчёты`)
};

const kk_admin_reports = /** @type {(inputs: Admin_ReportsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Есептер`)
};

const en_admin_reports = /** @type {(inputs: Admin_ReportsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reports`)
};

/**
* | output |
* | --- |
* | "Reports" |
*
* @param {Admin_ReportsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_reports = /** @type {((inputs?: Admin_ReportsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_ReportsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_admin_reports(inputs)
	if (locale === "en") return en_admin_reports(inputs)
	return ru_admin_reports(inputs)
});