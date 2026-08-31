/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Escalations_Units_TitleInputs */

const ru_escalations_units_title = /** @type {(inputs: Escalations_Units_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Эскалации по подразделениям`)
};

const kk_escalations_units_title = /** @type {(inputs: Escalations_Units_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөлімшелер бойынша эскалациялар`)
};

const en_escalations_units_title = /** @type {(inputs: Escalations_Units_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escalations by unit`)
};

/**
* | output |
* | --- |
* | "Escalations by unit" |
*
* @param {Escalations_Units_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const escalations_units_title = /** @type {((inputs?: Escalations_Units_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Escalations_Units_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_escalations_units_title(inputs)
	if (locale === "en") return en_escalations_units_title(inputs)
	return ru_escalations_units_title(inputs)
});