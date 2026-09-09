/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Source_ScheduleInputs */

const ru_source_schedule = /** @type {(inputs: Source_ScheduleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Расписание`)
};

const kk_source_schedule = /** @type {(inputs: Source_ScheduleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Кесте`)
};

const en_source_schedule = /** @type {(inputs: Source_ScheduleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Schedule`)
};

/**
* | output |
* | --- |
* | "Schedule" |
*
* @param {Source_ScheduleInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const source_schedule = /** @type {((inputs?: Source_ScheduleInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Source_ScheduleInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_source_schedule(inputs)
	if (locale === "en") return en_source_schedule(inputs)
	return ru_source_schedule(inputs)
});