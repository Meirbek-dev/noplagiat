/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Section_Role_RestrictedInputs */

const ru_section_role_restricted = /** @type {(inputs: Section_Role_RestrictedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Раздел доступен Совету по этике и Комплаенс-службе. Если он нужен вам по работе, обратитесь к администратору системы.`)
};

const kk_section_role_restricted = /** @type {(inputs: Section_Role_RestrictedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бөлім Этика кеңесі мен Комплаенс қызметіне қолжетімді. Ол сізге жұмыс бойынша қажет болса, жүйе әкімшісіне хабарласыңыз.`)
};

const en_section_role_restricted = /** @type {(inputs: Section_Role_RestrictedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This section is available to the ethics council and the compliance service. If you need it for your work, contact the system administrator.`)
};

/**
* | output |
* | --- |
* | "This section is available to the ethics council and the compliance service. If you need it for your work, contact the system administrator." |
*
* @param {Section_Role_RestrictedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const section_role_restricted = /** @type {((inputs?: Section_Role_RestrictedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Section_Role_RestrictedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_section_role_restricted(inputs)
	if (locale === "en") return en_section_role_restricted(inputs)
	return ru_section_role_restricted(inputs)
});