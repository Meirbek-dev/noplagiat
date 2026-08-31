/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Status_AcceptedInputs */

const ru_status_accepted = /** @type {(inputs: Status_AcceptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Принято`)
};

const kk_status_accepted = /** @type {(inputs: Status_AcceptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қабылданды`)
};

const en_status_accepted = /** @type {(inputs: Status_AcceptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Accepted`)
};

/**
* | output |
* | --- |
* | "Accepted" |
*
* @param {Status_AcceptedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const status_accepted = /** @type {((inputs?: Status_AcceptedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Status_AcceptedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_status_accepted(inputs)
	if (locale === "en") return en_status_accepted(inputs)
	return ru_status_accepted(inputs)
});