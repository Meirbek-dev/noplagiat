/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Setting_Snapshot_QuarterInputs */

const ru_setting_snapshot_quarter = /** @type {(inputs: Setting_Snapshot_QuarterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Квартал публикации среза`)
};

const kk_setting_snapshot_quarter = /** @type {(inputs: Setting_Snapshot_QuarterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кесінді жариялау тоқсаны`)
};

const en_setting_snapshot_quarter = /** @type {(inputs: Setting_Snapshot_QuarterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Public snapshot quarter`)
};

/**
* | output |
* | --- |
* | "Public snapshot quarter" |
*
* @param {Setting_Snapshot_QuarterInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_snapshot_quarter = /** @type {((inputs?: Setting_Snapshot_QuarterInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Snapshot_QuarterInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_setting_snapshot_quarter(inputs)
	if (locale === "en") return en_setting_snapshot_quarter(inputs)
	return ru_setting_snapshot_quarter(inputs)
});