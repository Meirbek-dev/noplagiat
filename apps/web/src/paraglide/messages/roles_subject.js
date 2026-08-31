/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Roles_SubjectInputs */

const ru_roles_subject = /** @type {(inputs: Roles_SubjectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Идентификатор SSO`)
};

const kk_roles_subject = /** @type {(inputs: Roles_SubjectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`SSO идентификаторы`)
};

const en_roles_subject = /** @type {(inputs: Roles_SubjectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`SSO subject`)
};

/**
* | output |
* | --- |
* | "SSO subject" |
*
* @param {Roles_SubjectInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const roles_subject = /** @type {((inputs?: Roles_SubjectInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Roles_SubjectInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_roles_subject(inputs)
	if (locale === "en") return en_roles_subject(inputs)
	return ru_roles_subject(inputs)
});