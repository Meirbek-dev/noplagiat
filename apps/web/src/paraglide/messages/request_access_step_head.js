/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Request_Access_Step_HeadInputs */

const ru_request_access_step_head = /** @type {(inputs: Request_Access_Step_HeadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Руководитель подразделения направляет заявку на доступ.`)
};

const kk_request_access_step_head = /** @type {(inputs: Request_Access_Step_HeadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөлімше басшысы қолжетімділікке өтініш жібереді.`)
};

const en_request_access_step_head = /** @type {(inputs: Request_Access_Step_HeadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The head of your unit submits an access request.`)
};

/**
* | output |
* | --- |
* | "The head of your unit submits an access request." |
*
* @param {Request_Access_Step_HeadInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_step_head = /** @type {((inputs?: Request_Access_Step_HeadInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Request_Access_Step_HeadInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_request_access_step_head(inputs)
	if (locale === "en") return en_request_access_step_head(inputs)
	return ru_request_access_step_head(inputs)
});