/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Bucket_Lt_50Inputs */

const ru_chart_bucket_lt_50 = /** @type {(inputs: Chart_Bucket_Lt_50Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ниже 50%`)
};

const kk_chart_bucket_lt_50 = /** @type {(inputs: Chart_Bucket_Lt_50Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`50%-дан төмен`)
};

const en_chart_bucket_lt_50 = /** @type {(inputs: Chart_Bucket_Lt_50Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`below 50%`)
};

/**
* | output |
* | --- |
* | "below 50%" |
*
* @param {Chart_Bucket_Lt_50Inputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_bucket_lt_50 = /** @type {((inputs?: Chart_Bucket_Lt_50Inputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Bucket_Lt_50Inputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_bucket_lt_50(inputs)
	if (locale === "en") return en_chart_bucket_lt_50(inputs)
	return ru_chart_bucket_lt_50(inputs)
});