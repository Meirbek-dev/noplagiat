/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Footer_About_BodyInputs */

const ru_footer_about_body = /** @type {(inputs: Footer_About_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Дашборд публикует обезличенную статистику проверки письменных работ на заимствования в Toraighyrov University. Показатели приведены в сводном виде - по университету, факультетам и типам работ; данные об отдельных авторах и работах не публикуются.`)
};

const kk_footer_about_body = /** @type {(inputs: Footer_About_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Дашборд Toraighyrov University-де жазба жұмыстарды алынған материалдарға тексеру бойынша дербестендірілмеген статистиканы жариялайды. Көрсеткіштер жиынтық түрде - университет, факультеттер және жұмыс түрлері бойынша беріледі; жекелеген авторлар мен жұмыстар туралы деректер жарияланбайды.`)
};

const en_footer_about_body = /** @type {(inputs: Footer_About_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This dashboard publishes anonymized statistics on originality checks of written work at Toraighyrov University. Figures are aggregated - by university, faculty and work type; no data about individual authors or works is published.`)
};

/**
* | output |
* | --- |
* | "This dashboard publishes anonymized statistics on originality checks of written work at Toraighyrov University. Figures are aggregated - by university, facul..." |
*
* @param {Footer_About_BodyInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const footer_about_body = /** @type {((inputs?: Footer_About_BodyInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Footer_About_BodyInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_footer_about_body(inputs)
	if (locale === "en") return en_footer_about_body(inputs)
	return ru_footer_about_body(inputs)
});