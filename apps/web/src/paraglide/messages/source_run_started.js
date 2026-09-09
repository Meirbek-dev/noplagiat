/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Source_Run_StartedInputs */

const ru_source_run_started = /** @type {(inputs: Source_Run_StartedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Загрузка запущена - следите за журналом импорта.`)
};

const kk_source_run_started = /** @type {(inputs: Source_Run_StartedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жүктеме іске қосылды - импорт журналын қадағалаңыз.`)
};

const en_source_run_started = /** @type {(inputs: Source_Run_StartedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The run has started - watch the import journal.`)
};

/**
* | output |
* | --- |
* | "The run has started - watch the import journal." |
*
* @param {Source_Run_StartedInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_run_started = /** @type {((inputs?: Source_Run_StartedInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_Run_StartedInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_source_run_started(inputs)
	if (locale === "en") return en_source_run_started(inputs)
	return ru_source_run_started(inputs)
});