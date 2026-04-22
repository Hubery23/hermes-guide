export type Locale = 'zh-CN' | 'en';

export function detectLocale(pathname: string): Locale {
	if (pathname === '/en' || pathname === '/en/' || pathname.startsWith('/en/')) {
		return 'en';
	}
	return 'zh-CN';
}

export function stripLocale(pathname: string): string {
	if (pathname === '/en' || pathname === '/en/') return '/';
	if (pathname.startsWith('/en/')) return pathname.slice(3);
	return pathname;
}

export function swapLocalePath(pathname: string, target: Locale): string {
	const stripped = stripLocale(pathname);
	if (target === 'en') {
		return stripped === '/' ? '/en/' : `/en${stripped}`;
	}
	return stripped;
}
