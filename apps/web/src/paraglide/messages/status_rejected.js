/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Status_RejectedInputs */

const ru_status_rejected = /** @type {(inputs: Status_RejectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Отклонено`)
};

const kk_status_rejected = /** @type {(inputs: Status_RejectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қабылданбады`)
};

const en_status_rejected = /** @type {(inputs: Status_RejectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rejected`)
};

/**
* | output |
* | --- |
* | "Rejected" |
*
* @param {Status_RejectedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const status_rejected = /** @type {((inputs?: Status_RejectedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Status_RejectedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_status_rejected(inputs)
	if (locale === "en") return en_status_rejected(inputs)
	return ru_status_rejected(inputs)
});