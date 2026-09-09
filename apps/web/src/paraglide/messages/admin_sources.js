/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_SourcesInputs */

const ru_admin_sources = /** @type {(inputs: Admin_SourcesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Источники данных`)
};

const kk_admin_sources = /** @type {(inputs: Admin_SourcesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Деректер көздері`)
};

const en_admin_sources = /** @type {(inputs: Admin_SourcesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Data sources`)
};

/**
* | output |
* | --- |
* | "Data sources" |
*
* @param {Admin_SourcesInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_sources = /** @type {((inputs?: Admin_SourcesInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_SourcesInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_admin_sources(inputs)
	if (locale === "en") return en_admin_sources(inputs)
	return ru_admin_sources(inputs)
});