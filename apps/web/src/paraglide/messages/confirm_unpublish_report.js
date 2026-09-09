/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Confirm_Unpublish_ReportInputs */

const ru_confirm_unpublish_report = /** @type {(inputs: Confirm_Unpublish_ReportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Снять отчёт с публикации? Он перестанет быть доступен на публичном дашборде.`)
};

const kk_confirm_unpublish_report = /** @type {(inputs: Confirm_Unpublish_ReportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Есепті жарияланымнан алу керек пе? Ол ашық дашбордта қолжетімсіз болады.`)
};

const en_confirm_unpublish_report = /** @type {(inputs: Confirm_Unpublish_ReportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unpublish this report? It will no longer be available on the public dashboard.`)
};

/**
* | output |
* | --- |
* | "Unpublish this report? It will no longer be available on the public dashboard." |
*
* @param {Confirm_Unpublish_ReportInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const confirm_unpublish_report = /** @type {((inputs?: Confirm_Unpublish_ReportInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Confirm_Unpublish_ReportInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_confirm_unpublish_report(inputs)
	if (locale === "en") return en_confirm_unpublish_report(inputs)
	return ru_confirm_unpublish_report(inputs)
});