/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Source_RunInputs */

const ru_source_run = /** @type {(inputs: Source_RunInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Запустить импорт`)
};

const kk_source_run = /** @type {(inputs: Source_RunInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Импортты іске қосу`)
};

const en_source_run = /** @type {(inputs: Source_RunInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Run import`)
};

/**
* | output |
* | --- |
* | "Run import" |
*
* @param {Source_RunInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_run = /** @type {((inputs?: Source_RunInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_RunInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_source_run(inputs)
	if (locale === "en") return en_source_run(inputs)
	return ru_source_run(inputs)
});