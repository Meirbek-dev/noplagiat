/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Rechecks_Units_TitleInputs */

const ru_rechecks_units_title = /** @type {(inputs: Rechecks_Units_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Повторные проверки по подразделениям`)
};

const kk_rechecks_units_title = /** @type {(inputs: Rechecks_Units_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөлімшелер бойынша қайта тексерулер`)
};

const en_rechecks_units_title = /** @type {(inputs: Rechecks_Units_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rechecks by unit`)
};

/**
* | output |
* | --- |
* | "Rechecks by unit" |
*
* @param {Rechecks_Units_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const rechecks_units_title = /** @type {((inputs?: Rechecks_Units_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rechecks_Units_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_rechecks_units_title(inputs)
	if (locale === "en") return en_rechecks_units_title(inputs)
	return ru_rechecks_units_title(inputs)
});