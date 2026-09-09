/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Confirm_DeleteInputs */

const ru_confirm_delete = /** @type {(inputs: Confirm_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Удалить запись? Действие необратимо.`)
};

const kk_confirm_delete = /** @type {(inputs: Confirm_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жазбаны жою керек пе? Әрекет қайтарылмайды.`)
};

const en_confirm_delete = /** @type {(inputs: Confirm_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete this entry? This cannot be undone.`)
};

/**
* | output |
* | --- |
* | "Delete this entry? This cannot be undone." |
*
* @param {Confirm_DeleteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const confirm_delete = /** @type {((inputs?: Confirm_DeleteInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Confirm_DeleteInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_confirm_delete(inputs)
	if (locale === "en") return en_confirm_delete(inputs)
	return ru_confirm_delete(inputs)
});