/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_EmptyInputs */

const ru_chart_empty = /** @type {(inputs: Chart_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Нет данных по выбранным фильтрам`)
};

const kk_chart_empty = /** @type {(inputs: Chart_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Таңдалған сүзгілер бойынша деректер жоқ`)
};

const en_chart_empty = /** @type {(inputs: Chart_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No data for the selected filters`)
};

/**
* | output |
* | --- |
* | "No data for the selected filters" |
*
* @param {Chart_EmptyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_empty = /** @type {((inputs?: Chart_EmptyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_EmptyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_empty(inputs)
	if (locale === "en") return en_chart_empty(inputs)
	return ru_chart_empty(inputs)
});