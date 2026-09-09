/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Units_TitleInputs */

const ru_chart_units_title = /** @type {(inputs: Chart_Units_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Показатели по факультетам и кафедрам`)
};

const kk_chart_units_title = /** @type {(inputs: Chart_Units_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Факультеттер мен кафедралар бойынша көрсеткіштер`)
};

const en_chart_units_title = /** @type {(inputs: Chart_Units_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Metrics by faculty and department`)
};

/**
* | output |
* | --- |
* | "Metrics by faculty and department" |
*
* @param {Chart_Units_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_units_title = /** @type {((inputs?: Chart_Units_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Units_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_units_title(inputs)
	if (locale === "en") return en_chart_units_title(inputs)
	return ru_chart_units_title(inputs)
});