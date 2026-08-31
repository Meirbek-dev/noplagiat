/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Initiator_StudentInputs */

const ru_initiator_student = /** @type {(inputs: Initiator_StudentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Студент`)
};

const kk_initiator_student = /** @type {(inputs: Initiator_StudentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Студент`)
};

const en_initiator_student = /** @type {(inputs: Initiator_StudentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Student`)
};

/**
* | output |
* | --- |
* | "Student" |
*
* @param {Initiator_StudentInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const initiator_student = /** @type {((inputs?: Initiator_StudentInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Initiator_StudentInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_initiator_student(inputs)
	if (locale === "en") return en_initiator_student(inputs)
	return ru_initiator_student(inputs)
});