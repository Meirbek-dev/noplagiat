/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Usage_No_DataInputs */

const ru_usage_no_data = /** @type {(inputs: Usage_No_DataInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`нет данных`)
};

const kk_usage_no_data = /** @type {(inputs: Usage_No_DataInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`деректер жоқ`)
};

const en_usage_no_data = /** @type {(inputs: Usage_No_DataInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`no data`)
};

/**
* | output |
* | --- |
* | "no data" |
*
* @param {Usage_No_DataInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const usage_no_data = /** @type {((inputs?: Usage_No_DataInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Usage_No_DataInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_usage_no_data(inputs)
	if (locale === "en") return en_usage_no_data(inputs)
	return ru_usage_no_data(inputs)
});