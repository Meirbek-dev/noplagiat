/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Batches_EmptyInputs */

const ru_batches_empty = /** @type {(inputs: Batches_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Загрузок ещё не было.`)
};

const kk_batches_empty = /** @type {(inputs: Batches_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Әзірге жүктемелер болған жоқ.`)
};

const en_batches_empty = /** @type {(inputs: Batches_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No imports yet.`)
};

/**
* | output |
* | --- |
* | "No imports yet." |
*
* @param {Batches_EmptyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batches_empty = /** @type {((inputs?: Batches_EmptyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batches_EmptyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_batches_empty(inputs)
	if (locale === "en") return en_batches_empty(inputs)
	return ru_batches_empty(inputs)
});