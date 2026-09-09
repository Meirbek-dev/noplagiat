/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Status_RecheckInputs */

const ru_status_recheck = /** @type {(inputs: Status_RecheckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Повторная проверка`)
};

const kk_status_recheck = /** @type {(inputs: Status_RecheckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қайта тексеру`)
};

const en_status_recheck = /** @type {(inputs: Status_RecheckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Recheck`)
};

/**
* | output |
* | --- |
* | "Recheck" |
*
* @param {Status_RecheckInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const status_recheck = /** @type {((inputs?: Status_RecheckInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Status_RecheckInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_status_recheck(inputs)
	if (locale === "en") return en_status_recheck(inputs)
	return ru_status_recheck(inputs)
});