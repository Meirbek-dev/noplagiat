/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Escalations_Units_NoteInputs */

const ru_escalations_units_note = /** @type {(inputs: Escalations_Units_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Разбивка по подразделениям всегда проходит проверку k-анонимности - независимо от роли.`)
};

const kk_escalations_units_note = /** @type {(inputs: Escalations_Units_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөлімшелер бойынша бөліну рөлге қарамастан әрқашан k-анонимдік тексеруінен өтеді.`)
};

const en_escalations_units_note = /** @type {(inputs: Escalations_Units_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The per-unit breakdown is always k-screened, whatever the role.`)
};

/**
* | output |
* | --- |
* | "The per-unit breakdown is always k-screened, whatever the role." |
*
* @param {Escalations_Units_NoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const escalations_units_note = /** @type {((inputs?: Escalations_Units_NoteInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Escalations_Units_NoteInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_escalations_units_note(inputs)
	if (locale === "en") return en_escalations_units_note(inputs)
	return ru_escalations_units_note(inputs)
});