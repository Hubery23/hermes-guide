import { describe, it, expect } from 'vitest';
import { createTranslator } from '@lib/i18n';

const dictZh = { 'hero.title': '你好' };
const dictEn = { 'hero.title': 'Hello' };

describe('createTranslator', () => {
	it('returns the translation for a known key', () => {
		const t = createTranslator(dictZh);
		expect(t('hero.title')).toBe('你好');
	});
	it('returns key itself for unknown key', () => {
		const t = createTranslator(dictZh);
		expect(t('unknown.key')).toBe('unknown.key');
	});
	it('is locale-agnostic — caller passes dict', () => {
		const t = createTranslator(dictEn);
		expect(t('hero.title')).toBe('Hello');
	});
});
