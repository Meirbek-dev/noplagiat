/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Roles_Grant_HintInputs */

const ru_roles_grant_hint = /** @type {(inputs: Roles_Grant_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Декану нужен код факультета, заведующему кафедрой - код кафедры.`)
};

const kk_roles_grant_hint = /** @type {(inputs: Roles_Grant_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Деканға факультет коды, кафедра меңгерушісіне кафедра коды қажет.`)
};

const en_roles_grant_hint = /** @type {(inputs: Roles_Grant_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A dean needs a faculty code, a head of department a department code.`)
};

/**
* | output |
* | --- |
* | "A dean needs a faculty code, a head of department a department code." |
*
* @param {Roles_Grant_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_grant_hint = /** @type {((inputs?: Roles_Grant_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_Grant_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_roles_grant_hint(inputs)
	if (locale === "en") return en_roles_grant_hint(inputs)
	return ru_roles_grant_hint(inputs)
});