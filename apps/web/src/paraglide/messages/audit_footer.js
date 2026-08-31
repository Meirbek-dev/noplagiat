/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ total: NonNullable<unknown>, days: NonNullable<unknown> }} Audit_FooterInputs */

const ru_audit_footer = /** @type {(inputs: Audit_FooterInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Всего записей: ${i?.total}. Срок хранения - не менее ${i?.days} дней; удаление не предусмотрено.`)
};

const kk_audit_footer = /** @type {(inputs: Audit_FooterInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Барлық жазба: ${i?.total}. Сақтау мерзімі - кемінде ${i?.days} күн; жою қарастырылмаған.`)
};

const en_audit_footer = /** @type {(inputs: Audit_FooterInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.total} entries. Retention is at least ${i?.days} days; there is no deletion path.`)
};

/**
* | output |
* | --- |
* | "{total} entries. Retention is at least {days} days; there is no deletion path." |
*
* @param {Audit_FooterInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const audit_footer = /** @type {((inputs: Audit_FooterInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Audit_FooterInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_audit_footer(inputs)
	if (locale === "en") return en_audit_footer(inputs)
	return ru_audit_footer(inputs)
});