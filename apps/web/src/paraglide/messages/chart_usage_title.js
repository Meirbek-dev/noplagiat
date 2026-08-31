/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Usage_TitleInputs */

const ru_chart_usage_title = /** @type {(inputs: Chart_Usage_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Активные пользователи по месяцам`)
};

const kk_chart_usage_title = /** @type {(inputs: Chart_Usage_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Айлар бойынша белсенді пайдаланушылар`)
};

const en_chart_usage_title = /** @type {(inputs: Chart_Usage_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Active reviewers by month`)
};

/**
* | output |
* | --- |
* | "Active reviewers by month" |
*
* @param {Chart_Usage_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_usage_title = /** @type {((inputs?: Chart_Usage_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Usage_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_usage_title(inputs)
	if (locale === "en") return en_chart_usage_title(inputs)
	return ru_chart_usage_title(inputs)
});