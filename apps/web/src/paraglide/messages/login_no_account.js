/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Login_No_AccountInputs */

const ru_login_no_account = /** @type {(inputs: Login_No_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Учётные записи создаёт администратор системы. Если входа нет или пароль забыт - обратитесь к нему.`)
};

const kk_login_no_account = /** @type {(inputs: Login_No_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тіркелгілерді жүйе әкімшісі жасайды. Кіру мүмкіндігі болмаса немесе құпия сөз ұмытылса - оған хабарласыңыз.`)
};

const en_login_no_account = /** @type {(inputs: Login_No_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Accounts are created by the system administrator. Ask them if you have no sign-in or have forgotten your password.`)
};

/**
* | output |
* | --- |
* | "Accounts are created by the system administrator. Ask them if you have no sign-in or have forgotten your password." |
*
* @param {Login_No_AccountInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const login_no_account = /** @type {((inputs?: Login_No_AccountInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Login_No_AccountInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_login_no_account(inputs)
	if (locale === "en") return en_login_no_account(inputs)
	return ru_login_no_account(inputs)
});