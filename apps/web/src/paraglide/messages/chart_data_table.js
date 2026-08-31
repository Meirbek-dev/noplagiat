/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Chart_Data_TableInputs */

const ru_chart_data_table = /** @type {(inputs: Chart_Data_TableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Таблица данных`)
};

const kk_chart_data_table = /** @type {(inputs: Chart_Data_TableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Деректер кестесі`)
};

const en_chart_data_table = /** @type {(inputs: Chart_Data_TableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Data table`)
};

/**
* | output |
* | --- |
* | "Data table" |
*
* @param {Chart_Data_TableInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const chart_data_table = /** @type {((inputs?: Chart_Data_TableInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_Data_TableInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_chart_data_table(inputs)
	if (locale === "en") return en_chart_data_table(inputs)
	return ru_chart_data_table(inputs)
});