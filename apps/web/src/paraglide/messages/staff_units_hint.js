/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Staff_Units_HintInputs */

const ru_staff_units_hint = /** @type {(inputs: Staff_Units_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Связывает проверяющего с факультетом и кафедрой - на этом строится разбивка по подразделениям.`)
};

const kk_staff_units_hint = /** @type {(inputs: Staff_Units_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тексерушіні факультет пен кафедраға байланыстырады - бөлімшелер бойынша бөліну осыған негізделеді.`)
};

const en_staff_units_hint = /** @type {(inputs: Staff_Units_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ties a reviewer to a faculty and department; the unit breakdown is built on it.`)
};

/**
* | output |
* | --- |
* | "Ties a reviewer to a faculty and department; the unit breakdown is built on it." |
*
* @param {Staff_Units_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_units_hint = /** @type {((inputs?: Staff_Units_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Staff_Units_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_staff_units_hint(inputs)
	if (locale === "en") return en_staff_units_hint(inputs)
	return ru_staff_units_hint(inputs)
});