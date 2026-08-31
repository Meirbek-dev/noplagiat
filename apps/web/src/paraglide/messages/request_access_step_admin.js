/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Request_Access_Step_AdminInputs */

const ru_request_access_step_admin = /** @type {(inputs: Request_Access_Step_AdminInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Администратор системы выдаёт роль и область видимости - факультет или кафедру.`)
};

const kk_request_access_step_admin = /** @type {(inputs: Request_Access_Step_AdminInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жүйе әкімшісі рөл мен көріну аймағын - факультет немесе кафедра - береді.`)
};

const en_request_access_step_admin = /** @type {(inputs: Request_Access_Step_AdminInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The system administrator grants the role and its scope - a faculty or a department.`)
};

/**
* | output |
* | --- |
* | "The system administrator grants the role and its scope - a faculty or a department." |
*
* @param {Request_Access_Step_AdminInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_step_admin = /** @type {((inputs?: Request_Access_Step_AdminInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Request_Access_Step_AdminInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_request_access_step_admin(inputs)
	if (locale === "en") return en_request_access_step_admin(inputs)
	return ru_request_access_step_admin(inputs)
});