/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Work_Types_Single_BucketInputs */

const ru_work_types_single_bucket = /** @type {(inputs: Work_Types_Single_BucketInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Разбивка по типам работ недоступна: в выгрузке исходной системы нет поля с типом работы, а по названию документа определяется менее процента проверок. Всё остальное отнесено к типу «иное».`)
};

const kk_work_types_single_bucket = /** @type {(inputs: Work_Types_Single_BucketInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Жұмыс түрлері бойынша бөлініс қолжетімсіз: бастапқы жүйенің жүктемесінде жұмыс түрі өрісі жоқ, ал құжат атауы бойынша тексерулердің бір пайызынан азы анықталады. Қалғанының бәрі «өзге» түріне жатқызылған.`)
};

const en_work_types_single_bucket = /** @type {(inputs: Work_Types_Single_BucketInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No breakdown by work type is available: the source export carries no work-type field, and fewer than one per cent of checks can be classified from the document title. Everything else falls to «other».`)
};

/**
* | output |
* | --- |
* | "No breakdown by work type is available: the source export carries no work-type field, and fewer than one per cent of checks can be classified from the docume..." |
*
* @param {Work_Types_Single_BucketInputs} inputs
* @param {{ locale?: "ru" | "kk" | "en" }} options
* @returns {LocalizedString}
*/
export const work_types_single_bucket = /** @type {((inputs?: Work_Types_Single_BucketInputs, options?: { locale?: "ru" | "kk" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Work_Types_Single_BucketInputs, { locale?: "ru" | "kk" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "kk") return kk_work_types_single_bucket(inputs)
	if (locale === "en") return en_work_types_single_bucket(inputs)
	return ru_work_types_single_bucket(inputs)
});