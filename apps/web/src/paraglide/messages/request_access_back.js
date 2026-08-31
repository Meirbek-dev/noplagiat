/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Request_Access_BackInputs */

const ru_request_access_back = /** @type {(inputs: Request_Access_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Вернуться к публичной статистике`)
};

const kk_request_access_back = /** @type {(inputs: Request_Access_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ашық статистикаға оралу`)
};

const en_request_access_back = /** @type {(inputs: Request_Access_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Back to the public statistics`)
};

/**
* | output |
* | --- |
* | "Back to the public statistics" |
*
* @param {Request_Access_BackInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_back = /** @type {((inputs?: Request_Access_BackInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Request_Access_BackInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_request_access_back(inputs)
	if (locale === "en") return en_request_access_back(inputs)
	return ru_request_access_back(inputs)
});