export type Locale = 'zh-CN' | 'en';

function isEnPath(pathname: string): boolean {
	return pathname === '/en' || pathname === '/en/' || pathname.startsWith('/en/');
}

export function detectLocale(pathname: string): Locale {
	return isEnPath(pathname) ? 'en' : 'zh-CN';
}

export function stripLocale(pathname: string): string {
	if (!isEnPath(pathname)) return pathname;
	if (pathname === '/en' || pathname === '/en/') return '/';
	return pathname.slice(3);
}

export function swapLocalePath(pathname: string, target: Locale): string {
	const stripped = stripLocale(pathname);
	if (target === 'en') {
		return stripped === '/' ? '/en/' : `/en${stripped}`;
	}
	return stripped;
}
