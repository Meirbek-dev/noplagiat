/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Status_Needs_RevisionInputs */

const ru_status_needs_revision = /** @type {(inputs: Status_Needs_RevisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Направлено на доработку`)
};

const kk_status_needs_revision = /** @type {(inputs: Status_Needs_RevisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Пысықтауға жіберілді`)
};

const en_status_needs_revision = /** @type {(inputs: Status_Needs_RevisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Needs revision`)
};

/**
* | output |
* | --- |
* | "Needs revision" |
*
* @param {Status_Needs_RevisionInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const status_needs_revision = /** @type {((inputs?: Status_Needs_RevisionInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Status_Needs_RevisionInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_status_needs_revision(inputs)
	if (locale === "en") return en_status_needs_revision(inputs)
	return ru_status_needs_revision(inputs)
});