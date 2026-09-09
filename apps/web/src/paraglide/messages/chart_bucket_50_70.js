/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Bucket_50_70Inputs */

const ru_chart_bucket_50_70 = /** @type {(inputs: Chart_Bucket_50_70Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`50–70%`)
};

const kk_chart_bucket_50_70 = /** @type {(inputs: Chart_Bucket_50_70Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`50–70%`)
};

const en_chart_bucket_50_70 = /** @type {(inputs: Chart_Bucket_50_70Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`50–70%`)
};

/**
* | output |
* | --- |
* | "50–70%" |
*
* @param {Chart_Bucket_50_70Inputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_bucket_50_70 = /** @type {((inputs?: Chart_Bucket_50_70Inputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Bucket_50_70Inputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_bucket_50_70(inputs)
	if (locale === "en") return en_chart_bucket_50_70(inputs)
	return ru_chart_bucket_50_70(inputs)
});