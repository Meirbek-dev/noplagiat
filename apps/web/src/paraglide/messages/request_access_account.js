/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Request_Access_AccountInputs */

const ru_request_access_account = /** @type {(inputs: Request_Access_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ваша учётная запись`)
};

const kk_request_access_account = /** @type {(inputs: Request_Access_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сіздің тіркелгіңіз`)
};

const en_request_access_account = /** @type {(inputs: Request_Access_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your account`)
};

/**
* | output |
* | --- |
* | "Your account" |
*
* @param {Request_Access_AccountInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_account = /** @type {((inputs?: Request_Access_AccountInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Request_Access_AccountInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_request_access_account(inputs)
	if (locale === "en") return en_request_access_account(inputs)
	return ru_request_access_account(inputs)
});