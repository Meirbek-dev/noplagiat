/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Bucket_85_95Inputs */

const ru_chart_bucket_85_95 = /** @type {(inputs: Chart_Bucket_85_95Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`85–95%`)
};

const kk_chart_bucket_85_95 = /** @type {(inputs: Chart_Bucket_85_95Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`85–95%`)
};

const en_chart_bucket_85_95 = /** @type {(inputs: Chart_Bucket_85_95Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`85–95%`)
};

/**
* | output |
* | --- |
* | "85–95%" |
*
* @param {Chart_Bucket_85_95Inputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_bucket_85_95 = /** @type {((inputs?: Chart_Bucket_85_95Inputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Bucket_85_95Inputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_bucket_85_95(inputs)
	if (locale === "en") return en_chart_bucket_85_95(inputs)
	return ru_chart_bucket_85_95(inputs)
});