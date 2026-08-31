/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Login_Dev_WarningInputs */

const ru_login_dev_warning = /** @type {(inputs: Login_Dev_WarningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Создаёт сеанс без единого входа. Только для разработки и тестов; на рабочем стенде недоступно.`)
};

const kk_login_dev_warning = /** @type {(inputs: Login_Dev_WarningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бірыңғай кірусіз сеанс жасайды. Тек әзірлеу мен сынаққа арналған; жұмыс стендінде қолжетімсіз.`)
};

const en_login_dev_warning = /** @type {(inputs: Login_Dev_WarningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mints a session without SSO. Development and tests only; unavailable on a real deployment.`)
};

/**
* | output |
* | --- |
* | "Mints a session without SSO. Development and tests only; unavailable on a real deployment." |
*
* @param {Login_Dev_WarningInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_dev_warning = /** @type {((inputs?: Login_Dev_WarningInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_Dev_WarningInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_login_dev_warning(inputs)
	if (locale === "en") return en_login_dev_warning(inputs)
	return ru_login_dev_warning(inputs)
});