/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Export_Official_UseInputs */

const ru_export_official_use = /** @type {(inputs: Export_Official_UseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Для служебного пользования. Факт выгрузки журналируется.`)
};

const kk_export_official_use = /** @type {(inputs: Export_Official_UseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қызметтік пайдалану үшін. Жүктеп алу фактісі журналға жазылады.`)
};

const en_export_official_use = /** @type {(inputs: Export_Official_UseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`For official use only. The export is journalled.`)
};

/**
* | output |
* | --- |
* | "For official use only. The export is journalled." |
*
* @param {Export_Official_UseInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const export_official_use = /** @type {((inputs?: Export_Official_UseInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Export_Official_UseInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_export_official_use(inputs)
	if (locale === "en") return en_export_official_use(inputs)
	return ru_export_official_use(inputs)
});