/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Dynamics_TitleInputs */

const ru_chart_dynamics_title = /** @type {(inputs: Chart_Dynamics_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Проверки и средняя оригинальность по месяцам`)
};

const kk_chart_dynamics_title = /** @type {(inputs: Chart_Dynamics_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Айлар бойынша тексерулер және орташа бірегейлік`)
};

const en_chart_dynamics_title = /** @type {(inputs: Chart_Dynamics_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Checks and average originality by month`)
};

/**
* | output |
* | --- |
* | "Checks and average originality by month" |
*
* @param {Chart_Dynamics_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_dynamics_title = /** @type {((inputs?: Chart_Dynamics_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Dynamics_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_dynamics_title(inputs)
	if (locale === "en") return en_chart_dynamics_title(inputs)
	return ru_chart_dynamics_title(inputs)
});