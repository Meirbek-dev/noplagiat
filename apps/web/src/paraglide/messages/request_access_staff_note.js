/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Request_Access_Staff_NoteInputs */

const ru_request_access_staff_note = /** @type {(inputs: Request_Access_Staff_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Роль «ППС» даёт доступ к публичному контуру. Для детализации по кафедре нужна отдельная роль.`)
};

const kk_request_access_staff_note = /** @type {(inputs: Request_Access_Staff_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`«ПОҚ» рөлі ашық контурға қолжетімділік береді. Кафедра бойынша толық деректер үшін бөлек рөл қажет.`)
};

const en_request_access_staff_note = /** @type {(inputs: Request_Access_Staff_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The teaching-staff role covers the public contour. Unit-level detail needs a separate role.`)
};

/**
* | output |
* | --- |
* | "The teaching-staff role covers the public contour. Unit-level detail needs a separate role." |
*
* @param {Request_Access_Staff_NoteInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const request_access_staff_note = /** @type {((inputs?: Request_Access_Staff_NoteInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Request_Access_Staff_NoteInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_request_access_staff_note(inputs)
	if (locale === "en") return en_request_access_staff_note(inputs)
	return ru_request_access_staff_note(inputs)
});