/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Batches_HintInputs */

const ru_batches_hint = /** @type {(inputs: Batches_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Каждая загрузка фиксируется: время, источник, число записей, ошибки валидации.`)
};

const kk_batches_hint = /** @type {(inputs: Batches_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Әрбір жүктеме тіркеледі: уақыты, дереккөзі, жазба саны, тексеру қателері.`)
};

const en_batches_hint = /** @type {(inputs: Batches_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every run is journalled: time, source, row counts, validation errors.`)
};

/**
* | output |
* | --- |
* | "Every run is journalled: time, source, row counts, validation errors." |
*
* @param {Batches_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batches_hint = /** @type {((inputs?: Batches_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batches_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_batches_hint(inputs)
	if (locale === "en") return en_batches_hint(inputs)
	return ru_batches_hint(inputs)
});