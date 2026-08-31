/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_OverviewInputs */

const ru_admin_overview = /** @type {(inputs: Admin_OverviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Обзор`)
};

const kk_admin_overview = /** @type {(inputs: Admin_OverviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Шолу`)
};

const en_admin_overview = /** @type {(inputs: Admin_OverviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Overview`)
};

/**
* | output |
* | --- |
* | "Overview" |
*
* @param {Admin_OverviewInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_overview = /** @type {((inputs?: Admin_OverviewInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_OverviewInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_admin_overview(inputs)
	if (locale === "en") return en_admin_overview(inputs)
	return ru_admin_overview(inputs)
});