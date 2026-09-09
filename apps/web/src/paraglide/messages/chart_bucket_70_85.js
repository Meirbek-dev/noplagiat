/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Bucket_70_85Inputs */

const ru_chart_bucket_70_85 = /** @type {(inputs: Chart_Bucket_70_85Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`70–85%`)
};

const kk_chart_bucket_70_85 = /** @type {(inputs: Chart_Bucket_70_85Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`70–85%`)
};

const en_chart_bucket_70_85 = /** @type {(inputs: Chart_Bucket_70_85Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`70–85%`)
};

/**
* | output |
* | --- |
* | "70–85%" |
*
* @param {Chart_Bucket_70_85Inputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_bucket_70_85 = /** @type {((inputs?: Chart_Bucket_70_85Inputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Bucket_70_85Inputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_bucket_70_85(inputs)
	if (locale === "en") return en_chart_bucket_70_85(inputs)
	return ru_chart_bucket_70_85(inputs)
});