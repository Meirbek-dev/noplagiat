/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Setting_Exclude_DeletedInputs */

const ru_setting_exclude_deleted = /** @type {(inputs: Setting_Exclude_DeletedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Исключать удалённые документы`)
};

const kk_setting_exclude_deleted = /** @type {(inputs: Setting_Exclude_DeletedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жойылған құжаттарды қоспау`)
};

const en_setting_exclude_deleted = /** @type {(inputs: Setting_Exclude_DeletedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exclude deleted documents`)
};

/**
* | output |
* | --- |
* | "Exclude deleted documents" |
*
* @param {Setting_Exclude_DeletedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_exclude_deleted = /** @type {((inputs?: Setting_Exclude_DeletedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Exclude_DeletedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_setting_exclude_deleted(inputs)
	if (locale === "en") return en_setting_exclude_deleted(inputs)
	return ru_setting_exclude_deleted(inputs)
});