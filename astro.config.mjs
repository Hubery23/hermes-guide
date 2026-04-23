// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
	site: 'https://hermesagentguide.online',
	integrations: [
		starlight({
			title: {
				'zh-CN': 'Hermes/Agent',
				en: 'Hermes/Agent',
			},
			defaultLocale: 'root',
			locales: {
				root: { label: '中文', lang: 'zh-CN' },
				en: { label: 'English', lang: 'en' },
			},
			customCss: ['./src/styles/fonts.css', './src/styles/theme.css'],
			components: {
				ThemeSelect: './src/components/overrides/ThemeSelect.astro',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/Hubery23' },
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
