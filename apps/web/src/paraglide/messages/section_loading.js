/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_LoadingInputs */

const ru_section_loading = /** @type {(inputs: Section_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Загрузка данных`)
};

const kk_section_loading = /** @type {(inputs: Section_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Деректер жүктелуде`)
};

const en_section_loading = /** @type {(inputs: Section_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Loading data`)
};

/**
* | output |
* | --- |
* | "Loading data" |
*
* @param {Section_LoadingInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_loading = /** @type {((inputs?: Section_LoadingInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_LoadingInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_loading(inputs)
	if (locale === "en") return en_section_loading(inputs)
	return ru_section_loading(inputs)
});