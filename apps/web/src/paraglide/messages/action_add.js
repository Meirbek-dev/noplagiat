/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Action_AddInputs */

const ru_action_add = /** @type {(inputs: Action_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Добавить`)
};

const kk_action_add = /** @type {(inputs: Action_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Қосу`)
};

const en_action_add = /** @type {(inputs: Action_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add`)
};

/**
* | output |
* | --- |
* | "Add" |
*
* @param {Action_AddInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const action_add = /** @type {((inputs?: Action_AddInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Action_AddInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_action_add(inputs)
	if (locale === "en") return en_action_add(inputs)
	return ru_action_add(inputs)
});