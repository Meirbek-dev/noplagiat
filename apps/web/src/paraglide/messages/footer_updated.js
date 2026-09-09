/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Footer_UpdatedInputs */

const ru_footer_updated = /** @type {(inputs: Footer_UpdatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Данные обновляются не реже одного раза в сутки.`)
};

const kk_footer_updated = /** @type {(inputs: Footer_UpdatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Деректер тәулігіне кемінде бір рет жаңартылады.`)
};

const en_footer_updated = /** @type {(inputs: Footer_UpdatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The data is refreshed at least once a day.`)
};

/**
* | output |
* | --- |
* | "The data is refreshed at least once a day." |
*
* @param {Footer_UpdatedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const footer_updated = /** @type {((inputs?: Footer_UpdatedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Footer_UpdatedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_footer_updated(inputs)
	if (locale === "en") return en_footer_updated(inputs)
	return ru_footer_updated(inputs)
});