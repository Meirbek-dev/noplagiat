/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Faculties_TitleInputs */

const ru_chart_faculties_title = /** @type {(inputs: Chart_Faculties_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Показатели по факультетам`)
};

const kk_chart_faculties_title = /** @type {(inputs: Chart_Faculties_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Факультеттер бойынша көрсеткіштер`)
};

const en_chart_faculties_title = /** @type {(inputs: Chart_Faculties_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Figures by faculty`)
};

/**
* | output |
* | --- |
* | "Figures by faculty" |
*
* @param {Chart_Faculties_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_faculties_title = /** @type {((inputs?: Chart_Faculties_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Faculties_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_faculties_title(inputs)
	if (locale === "en") return en_chart_faculties_title(inputs)
	return ru_chart_faculties_title(inputs)
});