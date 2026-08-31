/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aliases_HintInputs */

const ru_aliases_hint = /** @type {(inputs: Aliases_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Приводит наименования исходной системы к справочникам дашборда.`)
};

const kk_aliases_hint = /** @type {(inputs: Aliases_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Бастапқы жүйенің атауларын дашборд анықтамалықтарына келтіреді.`)
};

const en_aliases_hint = /** @type {(inputs: Aliases_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Maps the source system's labels onto the dashboard dictionaries.`)
};

/**
* | output |
* | --- |
* | "Maps the source system's labels onto the dashboard dictionaries." |
*
* @param {Aliases_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const aliases_hint = /** @type {((inputs?: Aliases_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aliases_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_aliases_hint(inputs)
	if (locale === "en") return en_aliases_hint(inputs)
	return ru_aliases_hint(inputs)
});