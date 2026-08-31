/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Role_Dept_HeadInputs */

const ru_role_dept_head = /** @type {(inputs: Role_Dept_HeadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Заведующий кафедрой`)
};

const kk_role_dept_head = /** @type {(inputs: Role_Dept_HeadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кафедра меңгерушісі`)
};

const en_role_dept_head = /** @type {(inputs: Role_Dept_HeadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Head of department`)
};

/**
* | output |
* | --- |
* | "Head of department" |
*
* @param {Role_Dept_HeadInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const role_dept_head = /** @type {((inputs?: Role_Dept_HeadInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Role_Dept_HeadInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_role_dept_head(inputs)
	if (locale === "en") return en_role_dept_head(inputs)
	return ru_role_dept_head(inputs)
});