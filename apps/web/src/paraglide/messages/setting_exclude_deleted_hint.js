/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Setting_Exclude_Deleted_HintInputs */

const ru_setting_exclude_deleted_hint = /** @type {(inputs: Setting_Exclude_Deleted_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Записи с отметкой «Удалён» не попадают в агрегаты.`)
};

const kk_setting_exclude_deleted_hint = /** @type {(inputs: Setting_Exclude_Deleted_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`«Жойылған» белгісі бар жазбалар жиынтықтарға кірмейді.`)
};

const en_setting_exclude_deleted_hint = /** @type {(inputs: Setting_Exclude_Deleted_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rows marked deleted stay out of the aggregates.`)
};

/**
* | output |
* | --- |
* | "Rows marked deleted stay out of the aggregates." |
*
* @param {Setting_Exclude_Deleted_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_exclude_deleted_hint = /** @type {((inputs?: Setting_Exclude_Deleted_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Exclude_Deleted_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_setting_exclude_deleted_hint(inputs)
	if (locale === "en") return en_setting_exclude_deleted_hint(inputs)
	return ru_setting_exclude_deleted_hint(inputs)
});