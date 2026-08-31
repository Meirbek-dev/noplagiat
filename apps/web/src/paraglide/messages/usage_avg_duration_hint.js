/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Usage_Avg_Duration_HintInputs */

const ru_usage_avg_duration_hint = /** @type {(inputs: Usage_Avg_Duration_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Заполняется вручную Комплаенс-службой; выгрузка исходной системы этот показатель не содержит.`)
};

const kk_usage_avg_duration_hint = /** @type {(inputs: Usage_Avg_Duration_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Комплаенс қызметі қолмен толтырады; бастапқы жүйенің жүктемесінде бұл көрсеткіш жоқ.`)
};

const en_usage_avg_duration_hint = /** @type {(inputs: Usage_Avg_Duration_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Entered by hand by the compliance office; the source export does not carry it.`)
};

/**
* | output |
* | --- |
* | "Entered by hand by the compliance office; the source export does not carry it." |
*
* @param {Usage_Avg_Duration_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const usage_avg_duration_hint = /** @type {((inputs?: Usage_Avg_Duration_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Usage_Avg_Duration_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_usage_avg_duration_hint(inputs)
	if (locale === "en") return en_usage_avg_duration_hint(inputs)
	return ru_usage_avg_duration_hint(inputs)
});