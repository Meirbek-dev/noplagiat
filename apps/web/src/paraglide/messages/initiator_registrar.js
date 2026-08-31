/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Initiator_RegistrarInputs */

const ru_initiator_registrar = /** @type {(inputs: Initiator_RegistrarInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Офис регистратора`)
};

const kk_initiator_registrar = /** @type {(inputs: Initiator_RegistrarInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тіркеуші кеңсесі`)
};

const en_initiator_registrar = /** @type {(inputs: Initiator_RegistrarInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Registrar's office`)
};

/**
* | output |
* | --- |
* | "Registrar's office" |
*
* @param {Initiator_RegistrarInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const initiator_registrar = /** @type {((inputs?: Initiator_RegistrarInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Initiator_RegistrarInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_initiator_registrar(inputs)
	if (locale === "en") return en_initiator_registrar(inputs)
	return ru_initiator_registrar(inputs)
});