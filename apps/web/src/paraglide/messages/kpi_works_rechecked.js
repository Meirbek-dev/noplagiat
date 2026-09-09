/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Kpi_Works_RecheckedInputs */

const ru_kpi_works_rechecked = /** @type {(inputs: Kpi_Works_RecheckedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Прошли повторную проверку`)
};

const kk_kpi_works_rechecked = /** @type {(inputs: Kpi_Works_RecheckedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қайта тексеруден өтті`)
};

const en_kpi_works_rechecked = /** @type {(inputs: Kpi_Works_RecheckedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rechecked`)
};

/**
* | output |
* | --- |
* | "Rechecked" |
*
* @param {Kpi_Works_RecheckedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const kpi_works_rechecked = /** @type {((inputs?: Kpi_Works_RecheckedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kpi_Works_RecheckedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_kpi_works_rechecked(inputs)
	if (locale === "en") return en_kpi_works_rechecked(inputs)
	return ru_kpi_works_rechecked(inputs)
});