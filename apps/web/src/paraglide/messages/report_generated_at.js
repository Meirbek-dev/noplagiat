/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Generated_AtInputs */

const ru_report_generated_at = /** @type {(inputs: Report_Generated_AtInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сформирован`)
};

const kk_report_generated_at = /** @type {(inputs: Report_Generated_AtInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қалыптастырылды`)
};

const en_report_generated_at = /** @type {(inputs: Report_Generated_AtInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Generated`)
};

/**
* | output |
* | --- |
* | "Generated" |
*
* @param {Report_Generated_AtInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const report_generated_at = /** @type {((inputs?: Report_Generated_AtInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Generated_AtInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_report_generated_at(inputs)
	if (locale === "en") return en_report_generated_at(inputs)
	return ru_report_generated_at(inputs)
});