/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Units_Margin_FootnoteInputs */

const ru_units_margin_footnote = /** @type {(inputs: Units_Margin_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Итог по факультету включает кафедры, значения которых скрыты правилом k-анонимности, поэтому сумма строк может не совпадать с итогом.`)
};

const kk_units_margin_footnote = /** @type {(inputs: Units_Margin_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Факультет бойынша қорытынды k-анонимдік ережесімен жасырылған кафедраларды да қамтиды, сондықтан жолдар қосындысы қорытындымен сәйкес келмеуі мүмкін.`)
};

const en_units_margin_footnote = /** @type {(inputs: Units_Margin_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A faculty total includes departments whose own cells are suppressed, so the visible rows need not add up to it.`)
};

/**
* | output |
* | --- |
* | "A faculty total includes departments whose own cells are suppressed, so the visible rows need not add up to it." |
*
* @param {Units_Margin_FootnoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const units_margin_footnote = /** @type {((inputs?: Units_Margin_FootnoteInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Units_Margin_FootnoteInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_units_margin_footnote(inputs)
	if (locale === "en") return en_units_margin_footnote(inputs)
	return ru_units_margin_footnote(inputs)
});