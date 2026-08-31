/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_Sources_HintInputs */

const ru_admin_sources_hint = /** @type {(inputs: Admin_Sources_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Источники выгрузки и расписания обновления; ручной запуск импорта.`)
};

const kk_admin_sources_hint = /** @type {(inputs: Admin_Sources_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Деректерді жүктеу көздері мен жаңарту кестелері; импортты қолмен іске қосу.`)
};

const en_admin_sources_hint = /** @type {(inputs: Admin_Sources_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ingest sources and refresh schedules; manual import runs.`)
};

/**
* | output |
* | --- |
* | "Ingest sources and refresh schedules; manual import runs." |
*
* @param {Admin_Sources_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_sources_hint = /** @type {((inputs?: Admin_Sources_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Sources_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_admin_sources_hint(inputs)
	if (locale === "en") return en_admin_sources_hint(inputs)
	return ru_admin_sources_hint(inputs)
});