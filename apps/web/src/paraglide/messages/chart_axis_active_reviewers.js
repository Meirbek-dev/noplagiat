/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Axis_Active_ReviewersInputs */

const ru_chart_axis_active_reviewers = /** @type {(inputs: Chart_Axis_Active_ReviewersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Активных пользователей`)
};

const kk_chart_axis_active_reviewers = /** @type {(inputs: Chart_Axis_Active_ReviewersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Белсенді пайдаланушылар саны`)
};

const en_chart_axis_active_reviewers = /** @type {(inputs: Chart_Axis_Active_ReviewersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Active reviewers`)
};

/**
* | output |
* | --- |
* | "Active reviewers" |
*
* @param {Chart_Axis_Active_ReviewersInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_axis_active_reviewers = /** @type {((inputs?: Chart_Axis_Active_ReviewersInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Axis_Active_ReviewersInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_axis_active_reviewers(inputs)
	if (locale === "en") return en_chart_axis_active_reviewers(inputs)
	return ru_chart_axis_active_reviewers(inputs)
});