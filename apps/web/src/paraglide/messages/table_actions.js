/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Table_ActionsInputs */

const ru_table_actions = /** @type {(inputs: Table_ActionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Действия`)
};

const kk_table_actions = /** @type {(inputs: Table_ActionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Әрекеттер`)
};

const en_table_actions = /** @type {(inputs: Table_ActionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Actions`)
};

/**
* | output |
* | --- |
* | "Actions" |
*
* @param {Table_ActionsInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const table_actions = /** @type {((inputs?: Table_ActionsInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Table_ActionsInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_table_actions(inputs)
	if (locale === "en") return en_table_actions(inputs)
	return ru_table_actions(inputs)
});