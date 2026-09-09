/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_Last_Batch_HintInputs */

const ru_admin_last_batch_hint = /** @type {(inputs: Admin_Last_Batch_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Данные внутреннего контура обновляются не реже одного раза в сутки.`)
};

const kk_admin_last_batch_hint = /** @type {(inputs: Admin_Last_Batch_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ішкі контур деректері тәулігіне кемінде бір рет жаңартылады.`)
};

const en_admin_last_batch_hint = /** @type {(inputs: Admin_Last_Batch_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The internal contour refreshes at least once a day.`)
};

/**
* | output |
* | --- |
* | "The internal contour refreshes at least once a day." |
*
* @param {Admin_Last_Batch_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_last_batch_hint = /** @type {((inputs?: Admin_Last_Batch_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Last_Batch_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_admin_last_batch_hint(inputs)
	if (locale === "en") return en_admin_last_batch_hint(inputs)
	return ru_admin_last_batch_hint(inputs)
});