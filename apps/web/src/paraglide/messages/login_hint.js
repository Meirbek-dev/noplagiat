/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Login_HintInputs */

const ru_login_hint = /** @type {(inputs: Login_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Внутренний контур доступен через единый вход портала.`)
};

const kk_login_hint = /** @type {(inputs: Login_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ішкі контур порталдың бірыңғай кіруі арқылы қолжетімді.`)
};

const en_login_hint = /** @type {(inputs: Login_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The internal contour is behind the portal's single sign-on.`)
};

/**
* | output |
* | --- |
* | "The internal contour is behind the portal's single sign-on." |
*
* @param {Login_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_hint = /** @type {((inputs?: Login_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_login_hint(inputs)
	if (locale === "en") return en_login_hint(inputs)
	return ru_login_hint(inputs)
});