/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Request_Access_TitleInputs */

const ru_request_access_title = /** @type {(inputs: Request_Access_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Доступ к внутреннему контуру не выдан`)
};

const kk_request_access_title = /** @type {(inputs: Request_Access_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ішкі контурға қолжетімділік берілмеген`)
};

const en_request_access_title = /** @type {(inputs: Request_Access_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No access to the internal contour`)
};

/**
* | output |
* | --- |
* | "No access to the internal contour" |
*
* @param {Request_Access_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_title = /** @type {((inputs?: Request_Access_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Request_Access_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_request_access_title(inputs)
	if (locale === "en") return en_request_access_title(inputs)
	return ru_request_access_title(inputs)
});