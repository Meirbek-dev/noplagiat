/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_Last_BatchInputs */

const ru_admin_last_batch = /** @type {(inputs: Admin_Last_BatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Последняя загрузка`)
};

const kk_admin_last_batch = /** @type {(inputs: Admin_Last_BatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Соңғы жүктеме`)
};

const en_admin_last_batch = /** @type {(inputs: Admin_Last_BatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Last import`)
};

/**
* | output |
* | --- |
* | "Last import" |
*
* @param {Admin_Last_BatchInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_last_batch = /** @type {((inputs?: Admin_Last_BatchInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Last_BatchInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_admin_last_batch(inputs)
	if (locale === "en") return en_admin_last_batch(inputs)
	return ru_admin_last_batch(inputs)
});