// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// 英文翻译尚未完成的页面：不进入 sitemap，也在文件里 noindex
const EN_STUB_PATHS = [
	'/en/7-days/day-01/',
	'/en/7-days/day-02/',
	'/en/7-days/day-03/',
	'/en/7-days/day-04/',
	'/en/7-days/day-05/',
	'/en/7-days/day-06/',
	'/en/7-days/day-07/',
	'/en/migrate/from-openclaw/',
];

// https://astro.build/config
export default defineConfig({
	site: 'https://hermesagentguide.online',
	integrations: [
		sitemap({
			filter: (page) => {
				const path = new URL(page).pathname;
				return !EN_STUB_PATHS.some((stub) => path === stub || path === stub.replace(/\/$/, ''));
			},
		}),
		starlight({
			title: {
				'zh-CN': 'Hermes Agent 中文教程',
				en: 'Hermes Agent Tutorial',
			},
			defaultLocale: 'root',
			locales: {
				root: { label: '中文', lang: 'zh-CN' },
				en: { label: 'English', lang: 'en' },
			},
			customCss: ['./src/styles/fonts.css', './src/styles/theme.css'],
			head: [
				// Favicon 家族（补 SVG 之外的 PNG 尺寸 + Apple touch + manifest）
				{ tag: 'link', attrs: { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' } },
				{ tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' } },
				{ tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' } },
				{ tag: 'link', attrs: { rel: 'manifest', href: '/site.webmanifest' } },
				{ tag: 'meta', attrs: { name: 'theme-color', content: '#e8e2d4' } },
				// 默认 OG / Twitter 卡片（文档页兜底；Starlight 本身不给 og:image）
				{ tag: 'meta', attrs: { property: 'og:site_name', content: 'Hermes Agent 中文指南' } },
				{ tag: 'meta', attrs: { property: 'og:image', content: 'https://hermesagentguide.online/og/docs.png' } },
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
				{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
				{ tag: 'meta', attrs: { name: 'twitter:image', content: 'https://hermesagentguide.online/og/docs.png' } },
			],
			components: {
				ThemeSelect: './src/components/overrides/ThemeSelect.astro',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/Hubery23/hermes-guide' },
			],
			sidebar: [
				{
					label: '7 天入门',
					translations: { en: '7-Day Tutorial' },
					autogenerate: { directory: '7-days' },
				},
				{
					label: '迁移',
					translations: { en: 'Migrate' },
					autogenerate: { directory: 'migrate' },
				},
			],
		}),
		mdx(),
	],
});
