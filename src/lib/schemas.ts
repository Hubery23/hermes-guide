// 页面级 JSON-LD 生成器。所有 @id / URL 统一走 SITE 常量，避免拼接错误。
import type { Locale } from './locale';

export const SITE = 'https://hermesagentguide.online';

const siteName = (locale: Locale) =>
	locale === 'zh-CN' ? 'Hermes Agent 中文指南' : 'Hermes Agent Guide';

const orgName = (locale: Locale) =>
	locale === 'zh-CN' ? 'Hermes Agent 中文指南' : 'Hermes Agent Guide';

export function websiteSchema(locale: Locale) {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': `${SITE}/#website`,
		name: siteName(locale),
		url: SITE,
		inLanguage: locale === 'zh-CN' ? 'zh-CN' : 'en',
		publisher: { '@id': `${SITE}/#organization` },
	};
}

export function organizationSchema(locale: Locale) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': `${SITE}/#organization`,
		name: orgName(locale),
		url: SITE,
		logo: `${SITE}/favicon.svg`,
		sameAs: ['https://github.com/Hubery23/hermes-guide'],
	};
}

export function courseSchema(locale: Locale) {
	const isZh = locale === 'zh-CN';
	const path = isZh ? '/7-days/' : '/en/7-days/';
	return {
		'@context': 'https://schema.org',
		'@type': 'Course',
		name: isZh ? 'Hermes Agent 七日入门教程' : 'Hermes Agent 7-Day Tutorial',
		description: isZh
			? '七天从零上手 Hermes Agent：安装、模型接入、IM 接入、工具、Skills、记忆、自动化。'
			: 'Seven-day hands-on course for Hermes Agent: install, models, messaging, tools, skills, memory, automation.',
		url: `${SITE}${path}`,
		inLanguage: locale === 'zh-CN' ? 'zh-CN' : 'en',
		provider: { '@id': `${SITE}/#organization` },
		hasCourseInstance: {
			'@type': 'CourseInstance',
			courseMode: 'online',
			courseWorkload: 'PT7H',
		},
	};
}

export function techArticleSchema(params: {
	locale: Locale;
	title: string;
	description: string;
	path: string;
	datePublished?: string;
	dateModified?: string;
}) {
	const { locale, title, description, path, datePublished, dateModified } = params;
	return {
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: title,
		description,
		url: `${SITE}${path}`,
		inLanguage: locale === 'zh-CN' ? 'zh-CN' : 'en',
		isPartOf: { '@id': `${SITE}/#website` },
		publisher: { '@id': `${SITE}/#organization` },
		...(datePublished ? { datePublished } : {}),
		...(dateModified ? { dateModified } : {}),
	};
}

export function breadcrumbSchema(
	items: Array<{ name: string; path: string }>,
) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((it, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: it.name,
			item: `${SITE}${it.path}`,
		})),
	};
}
