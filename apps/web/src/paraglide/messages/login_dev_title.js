/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Login_Dev_TitleInputs */

const ru_login_dev_title = /** @type {(inputs: Login_Dev_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Режим разработки`)
};

const kk_login_dev_title = /** @type {(inputs: Login_Dev_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Әзірлеу режимі`)
};

const en_login_dev_title = /** @type {(inputs: Login_Dev_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Development mode`)
};

/**
* | output |
* | --- |
* | "Development mode" |
*
* @param {Login_Dev_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_dev_title = /** @type {((inputs?: Login_Dev_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_Dev_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_login_dev_title(inputs)
	if (locale === "en") return en_login_dev_title(inputs)
	return ru_login_dev_title(inputs)
});