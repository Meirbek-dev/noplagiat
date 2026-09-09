/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Dynamics_Flags_TitleInputs */

const ru_chart_dynamics_flags_title = /** @type {(inputs: Chart_Dynamics_Flags_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Эскалации и повторные проверки по месяцам`)
};

const kk_chart_dynamics_flags_title = /** @type {(inputs: Chart_Dynamics_Flags_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Айлар бойынша эскалациялар және қайта тексерулер`)
};

const en_chart_dynamics_flags_title = /** @type {(inputs: Chart_Dynamics_Flags_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escalations and rechecks by month`)
};

/**
* | output |
* | --- |
* | "Escalations and rechecks by month" |
*
* @param {Chart_Dynamics_Flags_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_dynamics_flags_title = /** @type {((inputs?: Chart_Dynamics_Flags_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Dynamics_Flags_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_dynamics_flags_title(inputs)
	if (locale === "en") return en_chart_dynamics_flags_title(inputs)
	return ru_chart_dynamics_flags_title(inputs)
});