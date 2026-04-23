import zh from '@/content/i18n/zh-CN.json';
import en from '@/content/i18n/en.json';
import type { Locale } from './locale';

export const dicts: Record<Locale, Record<string, string>> = {
	'zh-CN': zh as Record<string, string>,
	en: en as Record<string, string>,
};

export function createTranslator(dict: Record<string, string>) {
	return (key: string): string => {
		const value = dict[key];
		if (value === undefined) {
			console.warn(`[i18n] missing key: ${key}`);
			return key;
		}
		return value;
	};
}

export function useT(locale: Locale) {
	return createTranslator(dicts[locale]);
}
