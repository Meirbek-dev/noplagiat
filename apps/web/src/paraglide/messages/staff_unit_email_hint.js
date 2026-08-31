/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Staff_Unit_Email_HintInputs */

const ru_staff_unit_email_hint = /** @type {(inputs: Staff_Unit_Email_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Адрес не сохраняется и не журналируется: сервер хранит только необратимый хеш и маску.`)
};

const kk_staff_unit_email_hint = /** @type {(inputs: Staff_Unit_Email_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Мекенжай сақталмайды және журналға жазылмайды: сервер тек қайтымсыз хэш пен масканы сақтайды.`)
};

const en_staff_unit_email_hint = /** @type {(inputs: Staff_Unit_Email_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The address is neither stored nor logged: the server keeps only an irreversible hash and a mask.`)
};

/**
* | output |
* | --- |
* | "The address is neither stored nor logged: the server keeps only an irreversible hash and a mask." |
*
* @param {Staff_Unit_Email_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const staff_unit_email_hint = /** @type {((inputs?: Staff_Unit_Email_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Staff_Unit_Email_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_staff_unit_email_hint(inputs)
	if (locale === "en") return en_staff_unit_email_hint(inputs)
	return ru_staff_unit_email_hint(inputs)
});