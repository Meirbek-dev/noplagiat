/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Audit_NoneInputs */

const ru_audit_none = /** @type {(inputs: Audit_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Записей по заданным фильтрам нет.`)
};

const kk_audit_none = /** @type {(inputs: Audit_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Берілген сүзгілер бойынша жазба жоқ.`)
};

const en_audit_none = /** @type {(inputs: Audit_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No entries match these filters.`)
};

/**
* | output |
* | --- |
* | "No entries match these filters." |
*
* @param {Audit_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_none = /** @type {((inputs?: Audit_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_audit_none(inputs)
	if (locale === "en") return en_audit_none(inputs)
	return ru_audit_none(inputs)
});