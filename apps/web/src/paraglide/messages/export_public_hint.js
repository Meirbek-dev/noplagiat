/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Export_Public_HintInputs */

const ru_export_public_hint = /** @type {(inputs: Export_Public_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Файл содержит показатели за выбранный период с учётом фильтров.`)
};

const kk_export_public_hint = /** @type {(inputs: Export_Public_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Файлда таңдалған кезеңнің сүзгілер ескерілген көрсеткіштері болады.`)
};

const en_export_public_hint = /** @type {(inputs: Export_Public_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The file contains the figures for the selected period with the current filters applied.`)
};

/**
* | output |
* | --- |
* | "The file contains the figures for the selected period with the current filters applied." |
*
* @param {Export_Public_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const export_public_hint = /** @type {((inputs?: Export_Public_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Export_Public_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_export_public_hint(inputs)
	if (locale === "en") return en_export_public_hint(inputs)
	return ru_export_public_hint(inputs)
});