/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_Reports_HintInputs */

const ru_admin_reports_hint = /** @type {(inputs: Admin_Reports_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Неизменяемые снимки отчётов. Публикация выводит файл на публичный контур.`)
};

const kk_admin_reports_hint = /** @type {(inputs: Admin_Reports_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Өзгермейтін есеп суреттері. Жариялау файлды ашық контурға шығарады.`)
};

const en_admin_reports_hint = /** @type {(inputs: Admin_Reports_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Immutable report snapshots. Publishing puts the file on the public contour.`)
};

/**
* | output |
* | --- |
* | "Immutable report snapshots. Publishing puts the file on the public contour." |
*
* @param {Admin_Reports_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_reports_hint = /** @type {((inputs?: Admin_Reports_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Reports_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_admin_reports_hint(inputs)
	if (locale === "en") return en_admin_reports_hint(inputs)
	return ru_admin_reports_hint(inputs)
});