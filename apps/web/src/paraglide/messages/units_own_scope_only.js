/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Units_Own_Scope_OnlyInputs */

const ru_units_own_scope_only = /** @type {(inputs: Units_Own_Scope_OnlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Разбивка недоступна: ваша область видимости - одно подразделение, его показатели приведены выше.`)
};

const kk_units_own_scope_only = /** @type {(inputs: Units_Own_Scope_OnlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөліну қолжетімсіз: сіздің көріну аймағыңыз - бір бөлімше, оның көрсеткіштері жоғарыда келтірілген.`)
};

const en_units_own_scope_only = /** @type {(inputs: Units_Own_Scope_OnlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No breakdown: your scope is a single unit, and its figures are above.`)
};

/**
* | output |
* | --- |
* | "No breakdown: your scope is a single unit, and its figures are above." |
*
* @param {Units_Own_Scope_OnlyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const units_own_scope_only = /** @type {((inputs?: Units_Own_Scope_OnlyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Units_Own_Scope_OnlyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_units_own_scope_only(inputs)
	if (locale === "en") return en_units_own_scope_only(inputs)
	return ru_units_own_scope_only(inputs)
});