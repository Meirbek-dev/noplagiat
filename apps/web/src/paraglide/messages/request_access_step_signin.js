/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Request_Access_Step_SigninInputs */

const ru_request_access_step_signin = /** @type {(inputs: Request_Access_Step_SigninInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`После выдачи роли войдите повторно - раздел откроется.`)
};

const kk_request_access_step_signin = /** @type {(inputs: Request_Access_Step_SigninInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Рөл берілгеннен кейін қайта кіріңіз - бөлім ашылады.`)
};

const en_request_access_step_signin = /** @type {(inputs: Request_Access_Step_SigninInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign in again once the role is granted, and the section opens.`)
};

/**
* | output |
* | --- |
* | "Sign in again once the role is granted, and the section opens." |
*
* @param {Request_Access_Step_SigninInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_step_signin = /** @type {((inputs?: Request_Access_Step_SigninInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Request_Access_Step_SigninInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_request_access_step_signin(inputs)
	if (locale === "en") return en_request_access_step_signin(inputs)
	return ru_request_access_step_signin(inputs)
});