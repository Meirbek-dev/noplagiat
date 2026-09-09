/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Source_NoneInputs */

const ru_source_none = /** @type {(inputs: Source_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Источники не настроены.`)
};

const kk_source_none = /** @type {(inputs: Source_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Дереккөздер бапталмаған.`)
};

const en_source_none = /** @type {(inputs: Source_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No sources configured.`)
};

/**
* | output |
* | --- |
* | "No sources configured." |
*
* @param {Source_NoneInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_none = /** @type {((inputs?: Source_NoneInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_NoneInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_source_none(inputs)
	if (locale === "en") return en_source_none(inputs)
	return ru_source_none(inputs)
});