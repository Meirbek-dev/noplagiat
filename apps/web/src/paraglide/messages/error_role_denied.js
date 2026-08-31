/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_Role_DeniedInputs */

const ru_error_role_denied = /** @type {(inputs: Error_Role_DeniedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ваша роль не даёт доступа к этому разделу. Обратитесь к администратору системы.`)
};

const kk_error_role_denied = /** @type {(inputs: Error_Role_DeniedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сіздің рөліңіз бұл бөлімге қолжеткізуге мүмкіндік бермейді. Жүйе әкімшісіне хабарласыңыз.`)
};

const en_error_role_denied = /** @type {(inputs: Error_Role_DeniedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your role does not grant access to this section. Contact the system administrator.`)
};

/**
* | output |
* | --- |
* | "Your role does not grant access to this section. Contact the system administrator." |
*
* @param {Error_Role_DeniedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const error_role_denied = /** @type {((inputs?: Error_Role_DeniedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Role_DeniedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_error_role_denied(inputs)
	if (locale === "en") return en_error_role_denied(inputs)
	return ru_error_role_denied(inputs)
});