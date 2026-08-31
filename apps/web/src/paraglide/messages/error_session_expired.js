/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_Session_ExpiredInputs */

const ru_error_session_expired = /** @type {(inputs: Error_Session_ExpiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сеанс завершён. Войдите повторно.`)
};

const kk_error_session_expired = /** @type {(inputs: Error_Session_ExpiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сеанс аяқталды. Қайта кіріңіз.`)
};

const en_error_session_expired = /** @type {(inputs: Error_Session_ExpiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The session has ended. Sign in again.`)
};

/**
* | output |
* | --- |
* | "The session has ended. Sign in again." |
*
* @param {Error_Session_ExpiredInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const error_session_expired = /** @type {((inputs?: Error_Session_ExpiredInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Session_ExpiredInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_error_session_expired(inputs)
	if (locale === "en") return en_error_session_expired(inputs)
	return ru_error_session_expired(inputs)
});