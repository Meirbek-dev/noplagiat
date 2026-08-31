/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Source_Schedule_HintInputs */

const ru_source_schedule_hint = /** @type {(inputs: Source_Schedule_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cron-выражение; пусто - только ручной запуск.`)
};

const kk_source_schedule_hint = /** @type {(inputs: Source_Schedule_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cron өрнегі; бос болса - тек қолмен іске қосу.`)
};

const en_source_schedule_hint = /** @type {(inputs: Source_Schedule_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cron expression; empty means manual runs only.`)
};

/**
* | output |
* | --- |
* | "Cron expression; empty means manual runs only." |
*
* @param {Source_Schedule_HintInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_schedule_hint = /** @type {((inputs?: Source_Schedule_HintInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_Schedule_HintInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_source_schedule_hint(inputs)
	if (locale === "en") return en_source_schedule_hint(inputs)
	return ru_source_schedule_hint(inputs)
});