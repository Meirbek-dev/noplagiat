/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Audit_FiltersInputs */

const ru_audit_filters = /** @type {(inputs: Audit_FiltersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Фильтры`)
};

const kk_audit_filters = /** @type {(inputs: Audit_FiltersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сүзгілер`)
};

const en_audit_filters = /** @type {(inputs: Audit_FiltersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filters`)
};

/**
* | output |
* | --- |
* | "Filters" |
*
* @param {Audit_FiltersInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_filters = /** @type {((inputs?: Audit_FiltersInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_FiltersInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_audit_filters(inputs)
	if (locale === "en") return en_audit_filters(inputs)
	return ru_audit_filters(inputs)
});