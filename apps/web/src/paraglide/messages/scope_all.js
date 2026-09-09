/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Scope_AllInputs */

const ru_scope_all = /** @type {(inputs: Scope_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Весь университет`)
};

const kk_scope_all = /** @type {(inputs: Scope_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бүкіл университет`)
};

const en_scope_all = /** @type {(inputs: Scope_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The whole university`)
};

/**
* | output |
* | --- |
* | "The whole university" |
*
* @param {Scope_AllInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const scope_all = /** @type {((inputs?: Scope_AllInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Scope_AllInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_scope_all(inputs)
	if (locale === "en") return en_scope_all(inputs)
	return ru_scope_all(inputs)
});