/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Source_Kind_ApiInputs */

const ru_source_kind_api = /** @type {(inputs: Source_Kind_ApiInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`REST API`)
};

const kk_source_kind_api = /** @type {(inputs: Source_Kind_ApiInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`REST API`)
};

const en_source_kind_api = /** @type {(inputs: Source_Kind_ApiInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`REST API`)
};

/**
* | output |
* | --- |
* | "REST API" |
*
* @param {Source_Kind_ApiInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_kind_api = /** @type {((inputs?: Source_Kind_ApiInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_Kind_ApiInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_source_kind_api(inputs)
	if (locale === "en") return en_source_kind_api(inputs)
	return ru_source_kind_api(inputs)
});