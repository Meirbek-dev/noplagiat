/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Login_Dev_UnavailableInputs */

const ru_login_dev_unavailable = /** @type {(inputs: Login_Dev_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`На этом стенде используется единый вход портала.`)
};

const kk_login_dev_unavailable = /** @type {(inputs: Login_Dev_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бұл стендте порталдың бірыңғай кіруі қолданылады.`)
};

const en_login_dev_unavailable = /** @type {(inputs: Login_Dev_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This deployment uses the portal's single sign-on.`)
};

/**
* | output |
* | --- |
* | "This deployment uses the portal's single sign-on." |
*
* @param {Login_Dev_UnavailableInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_dev_unavailable = /** @type {((inputs?: Login_Dev_UnavailableInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_Dev_UnavailableInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_login_dev_unavailable(inputs)
	if (locale === "en") return en_login_dev_unavailable(inputs)
	return ru_login_dev_unavailable(inputs)
});