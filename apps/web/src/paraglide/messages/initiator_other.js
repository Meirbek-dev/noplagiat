/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Initiator_OtherInputs */

const ru_initiator_other = /** @type {(inputs: Initiator_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Иное`)
};

const kk_initiator_other = /** @type {(inputs: Initiator_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Өзге`)
};

const en_initiator_other = /** @type {(inputs: Initiator_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Other`)
};

/**
* | output |
* | --- |
* | "Other" |
*
* @param {Initiator_OtherInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const initiator_other = /** @type {((inputs?: Initiator_OtherInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Initiator_OtherInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_initiator_other(inputs)
	if (locale === "en") return en_initiator_other(inputs)
	return ru_initiator_other(inputs)
});