/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_Counts_HintInputs */

const ru_admin_counts_hint = /** @type {(inputs: Admin_Counts_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Текущее наполнение системы.`)
};

const kk_admin_counts_hint = /** @type {(inputs: Admin_Counts_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жүйенің ағымдағы толтырылуы.`)
};

const en_admin_counts_hint = /** @type {(inputs: Admin_Counts_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What the system currently holds.`)
};

/**
* | output |
* | --- |
* | "What the system currently holds." |
*
* @param {Admin_Counts_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_counts_hint = /** @type {((inputs?: Admin_Counts_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Counts_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_admin_counts_hint(inputs)
	if (locale === "en") return en_admin_counts_hint(inputs)
	return ru_admin_counts_hint(inputs)
});