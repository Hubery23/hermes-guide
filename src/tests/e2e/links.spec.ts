import { test, expect } from '@playwright/test';

const pathsToProbe = [
	'/7-days/day-01/', '/7-days/day-02/', '/7-days/day-03/',
	'/7-days/day-04/', '/7-days/day-05/', '/7-days/day-06/',
	'/7-days/day-07/', '/migrate/', '/migrate/from-openclaw/', '/7-days/',
	'/en/7-days/day-01/', '/en/7-days/day-02/', '/en/7-days/day-03/',
	'/en/7-days/day-04/', '/en/7-days/day-05/', '/en/7-days/day-06/',
	'/en/7-days/day-07/', '/en/migrate/', '/en/migrate/from-openclaw/', '/en/7-days/',
];

test('all internal routes resolve (no 404)', async ({ request }) => {
	await Promise.all(pathsToProbe.map(async (path) => {
		const resp = await request.get(path);
		expect(resp.status(), `${path} should 200`).toBe(200);
	}));
});
