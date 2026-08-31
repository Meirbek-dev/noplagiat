/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Initiator_Staff_SelfInputs */

const ru_initiator_staff_self = /** @type {(inputs: Initiator_Staff_SelfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ППС (самопроверка)`)
};

const kk_initiator_staff_self = /** @type {(inputs: Initiator_Staff_SelfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ПОҚ (өзін-өзі тексеру)`)
};

const en_initiator_staff_self = /** @type {(inputs: Initiator_Staff_SelfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Teaching staff (self-check)`)
};

/**
* | output |
* | --- |
* | "Teaching staff (self-check)" |
*
* @param {Initiator_Staff_SelfInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const initiator_staff_self = /** @type {((inputs?: Initiator_Staff_SelfInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Initiator_Staff_SelfInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_initiator_staff_self(inputs)
	if (locale === "en") return en_initiator_staff_self(inputs)
	return ru_initiator_staff_self(inputs)
});