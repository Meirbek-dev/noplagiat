/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Alias_Source_LabelInputs */

const ru_alias_source_label = /** @type {(inputs: Alias_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Наименование в источнике`)
};

const kk_alias_source_label = /** @type {(inputs: Alias_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Дереккөздегі атауы`)
};

const en_alias_source_label = /** @type {(inputs: Alias_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Label in the source`)
};

/**
* | output |
* | --- |
* | "Label in the source" |
*
* @param {Alias_Source_LabelInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const alias_source_label = /** @type {((inputs?: Alias_Source_LabelInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Alias_Source_LabelInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_alias_source_label(inputs)
	if (locale === "en") return en_alias_source_label(inputs)
	return ru_alias_source_label(inputs)
});