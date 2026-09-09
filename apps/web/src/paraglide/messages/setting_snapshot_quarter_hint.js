/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Setting_Snapshot_Quarter_HintInputs */

const ru_setting_snapshot_quarter_hint = /** @type {(inputs: Setting_Snapshot_Quarter_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`«auto» - вместе с обновлением внутреннего контура.`)
};

const kk_setting_snapshot_quarter_hint = /** @type {(inputs: Setting_Snapshot_Quarter_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`«auto» - ішкі контурды жаңартумен бірге.`)
};

const en_setting_snapshot_quarter_hint = /** @type {(inputs: Setting_Snapshot_Quarter_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`«auto» - together with the internal refresh.`)
};

/**
* | output |
* | --- |
* | "«auto» - together with the internal refresh." |
*
* @param {Setting_Snapshot_Quarter_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const setting_snapshot_quarter_hint = /** @type {((inputs?: Setting_Snapshot_Quarter_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Setting_Snapshot_Quarter_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_setting_snapshot_quarter_hint(inputs)
	if (locale === "en") return en_setting_snapshot_quarter_hint(inputs)
	return ru_setting_snapshot_quarter_hint(inputs)
});