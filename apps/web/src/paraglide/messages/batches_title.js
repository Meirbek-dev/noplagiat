/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Batches_TitleInputs */

const ru_batches_title = /** @type {(inputs: Batches_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Журнал импорта`)
};

const kk_batches_title = /** @type {(inputs: Batches_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Импорт журналы`)
};

const en_batches_title = /** @type {(inputs: Batches_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Import journal`)
};

/**
* | output |
* | --- |
* | "Import journal" |
*
* @param {Batches_TitleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const batches_title = /** @type {((inputs?: Batches_TitleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Batches_TitleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_batches_title(inputs)
	if (locale === "en") return en_batches_title(inputs)
	return ru_batches_title(inputs)
});