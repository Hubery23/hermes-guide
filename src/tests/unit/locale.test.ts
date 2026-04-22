import { describe, it, expect } from 'vitest';
import { detectLocale, swapLocalePath, stripLocale } from '@lib/locale';

describe('detectLocale', () => {
	it('returns zh-CN for root path', () => {
		expect(detectLocale('/')).toBe('zh-CN');
	});
	it('returns zh-CN for any non-en path', () => {
		expect(detectLocale('/7-days/day-01')).toBe('zh-CN');
	});
	it('returns en for /en prefix', () => {
		expect(detectLocale('/en/')).toBe('en');
		expect(detectLocale('/en/7-days/day-01')).toBe('en');
	});
});

describe('swapLocalePath', () => {
	it('en → zh: strips /en prefix', () => {
		expect(swapLocalePath('/en/7-days/day-01', 'zh-CN')).toBe('/7-days/day-01');
		expect(swapLocalePath('/en/', 'zh-CN')).toBe('/');
	});
	it('zh → en: adds /en prefix', () => {
		expect(swapLocalePath('/7-days/day-01', 'en')).toBe('/en/7-days/day-01');
		expect(swapLocalePath('/', 'en')).toBe('/en/');
	});
	it('idempotent when target === current', () => {
		expect(swapLocalePath('/en/', 'en')).toBe('/en/');
		expect(swapLocalePath('/', 'zh-CN')).toBe('/');
	});
});

describe('stripLocale', () => {
	it('strips /en prefix', () => {
		expect(stripLocale('/en/7-days/day-01')).toBe('/7-days/day-01');
	});
	it('leaves zh paths unchanged', () => {
		expect(stripLocale('/7-days/day-01')).toBe('/7-days/day-01');
	});
});
