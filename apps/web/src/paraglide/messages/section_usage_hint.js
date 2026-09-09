/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_Usage_HintInputs */

const ru_section_usage_hint = /** @type {(inputs: Section_Usage_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Активные пользователи по месяцам и среднее время выполнения проверки.`)
};

const kk_section_usage_hint = /** @type {(inputs: Section_Usage_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Айлар бойынша белсенді пайдаланушылар және тексерудің орташа уақыты.`)
};

const en_section_usage_hint = /** @type {(inputs: Section_Usage_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Active reviewers per month and the average check duration.`)
};

/**
* | output |
* | --- |
* | "Active reviewers per month and the average check duration." |
*
* @param {Section_Usage_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_usage_hint = /** @type {((inputs?: Section_Usage_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Usage_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_usage_hint(inputs)
	if (locale === "en") return en_section_usage_hint(inputs)
	return ru_section_usage_hint(inputs)
});