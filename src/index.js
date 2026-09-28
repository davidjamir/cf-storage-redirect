const routes = {
	'/feed': 'feed.xml',
	'/sitemap.xml': 'sitemap.xml',
	'/sitemap-page.xml': 'sitemap-page.xml',
	'/sitemap-category.xml': 'sitemap-category.xml',
	'/ads.txt': 'ads.txt',
	'/robots.txt': 'robots.txt',
	'/api/site': 'site.json',
	'/api/latest': 'latest.json',
};

const protectedRoutes = new Set(['/api/site', '/api/latest', '/api/post']);

function getOrigin(hostname) {
	const parts = hostname.split('.');
	if (parts.length <= 2) return hostname;
	return parts.slice(-2).join('.');
}

export default {
	async fetch(request, env) {
		function isAuthorized(req) {
			const auth = req.headers.get('authorization');
			return auth === `Bearer ${env.INTERNAL_SECRET}`;
		}

		const url = new URL(request.url);
		const path = url.pathname;

		if (protectedRoutes.has(path) && !isAuthorized(request)) {
			return new Response('Unauthorized', { status: 401 });
		}

		const endpoints = {
			default: env.ENDPOINT_STORAGE_GENERAL,
			p1: 'https://storage1.viethoaduc-12.workers.dev',
			p2: 'https://storage2.thetimenews-us.workers.dev',
			p3: 'https://storage3.viethoaduc-21.workers.dev',
			p4: 'https://storage4.viethoaduc-21.workers.dev',
			p5: 'https://storage5.jenkinsapp-notification.workers.dev',
			p6: 'https://storage6.jenkinsapp-notification.workers.dev',
			p7: 'https://storage7.viethoaduc-12.workers.dev',
			p8: 'https://storage8.carlosantonio-thetimes.workers.dev',
			p9: 'https://storage9.carlosantonio-thetimes.workers.dev',
			p10: 'https://storage10.thetimenews-us.workers.dev',
			p11: 'https://storage11.chloemadison-pad.workers.dev',
			p12: 'https://storage12.chloemadison-pad.workers.dev',
			p13: 'https://storage13.anhduong-pad27.workers.dev',
			p14: 'https://storage14.anhduong-pad27.workers.dev',
			p15: 'https://storage15.chienmai1011.workers.dev',
			p16: 'https://storage16.chienmai1011.workers.dev',
			p17: 'https://storage17.viethoaduc-14.workers.dev',
			p18: 'https://storage18.viethoaduc-14.workers.dev',
			p19: 'https://storage19.alabama-center-network.workers.dev',
			p20: 'https://storage20.alabama-center-network.workers.dev',
			p21: 'https://storage21.duong-anhpham21.workers.dev',
			p22: 'https://storage22.duong-anhpham21.workers.dev',
			p23: 'https://storage23.viethoaduc-32.workers.dev',
			p24: 'https://storage24.viethoaduc-32.workers.dev',
			p25: 'https://storage25.viethoaduc-31.workers.dev',
			p26: 'https://storage26.viethoaduc-31.workers.dev',
			p27: 'https://storage27.youngladdy2.workers.dev',
			p28: 'https://storage28.youngladdy2.workers.dev',
			p29: 'https://storage29.hoaducviet2002.workers.dev',
			p30: 'https://storage30.hoaducviet2002.workers.dev',
			p31: 'https://storage31.viethoaduc-13.workers.dev',
			p32: 'https://storage32.viethoaduc-13.workers.dev',
			p33: 'https://storage33.chloemadison-alex1.workers.dev',
			p34: 'https://storage34.chloemadison-alex1.workers.dev',
			p35: 'https://storage35.chloemadison-alex771.workers.dev',
			p36: 'https://storage36.chloemadison-alex771.workers.dev',
			p37: 'https://storage37.leminhvu-sor21.workers.dev',
			p38: 'https://storage38.leminhvu-sor21.workers.dev',
			p39: 'https://storage39.jenkins-application.workers.dev',
			p40: 'https://storage40.jenkins-application.workers.dev',
			p41: 'https://storage41.hoaducviet1111.workers.dev',
			p42: 'https://storage42.hoaducviet1111.workers.dev',
		};

		function buildKey(url, path) {
			if (path === '/feed') {
				return {
					key: `${url.host}/${routes[path]}`,
					api: 'default',
					MAX_AGE: 60 * 5, // 5p
					S_MAX_AGE: 60 * 10, // 10p
					STALE_WHILE_REVALIDATE: 60 * 10, // 10p
					STALE_IF_ERROR: 60 * 60 * 24, // 1day
				};
			}
			if (path === '/sitemap.xml') {
				return {
					key: `${url.host}/${routes[path]}`,
					api: 'default',
					MAX_AGE: 60 * 60 * 12, // 12h
					S_MAX_AGE: 60 * 60 * 24, // 1day
					STALE_WHILE_REVALIDATE: 60 * 20, // 20p
					STALE_IF_ERROR: 60 * 60 * 24 * 7, // 7day
				};
			}
			if (path === '/sitemap-page.xml') {
				return {
					key: `${url.host}/${routes[path]}`,
					api: 'default',
					MAX_AGE: 60 * 60 * 12, // 12h
					S_MAX_AGE: 60 * 60 * 24, // 1day
					STALE_WHILE_REVALIDATE: 60 * 20, // 20p
					STALE_IF_ERROR: 60 * 60 * 24 * 7, // 7day
				};
			}
			if (path === '/sitemap-category.xml') {
				return {
					key: `${url.host}/${routes[path]}`,
					api: 'default',
					MAX_AGE: 60 * 60 * 12, // 12h
					S_MAX_AGE: 60 * 60 * 24, // 1day
					STALE_WHILE_REVALIDATE: 60 * 20, // 20p
					STALE_IF_ERROR: 60 * 60 * 24 * 7, // 7day
				};
			}
			if (path === '/ads.txt') {
				return {
					key: `${url.host}/${routes[path]}`,
					api: 'default',
					MAX_AGE: 60 * 60 * 12, // 12h
					S_MAX_AGE: 60 * 60 * 24, // 1day
					STALE_WHILE_REVALIDATE: 60 * 20, // 20p
					STALE_IF_ERROR: 60 * 60 * 24, // 1day
				};
			}
			if (path === '/robots.txt') {
				return {
					key: `${url.host}/${routes[path]}`,
					api: 'default',
					MAX_AGE: 60 * 60 * 24, // 1day
					S_MAX_AGE: 60 * 60 * 24 * 365, // 1year
					STALE_WHILE_REVALIDATE: 60 * 60, // 1h
					STALE_IF_ERROR: 60 * 60 * 24, // 1day
				};
			}
			if (path === '/api/site') {
				return {
					key: `${url.host}/${routes[path]}`,
					api: 'default',
					MAX_AGE: 60 * 60 * 12, // 12h
					S_MAX_AGE: 60 * 60 * 24, // 1day
					STALE_WHILE_REVALIDATE: 60 * 20, // 20p
					STALE_IF_ERROR: 60 * 60 * 24 * 7, // 7day
				};
			}
			if (path === '/api/latest') {
				return {
					key: `${url.host}/${routes[path]}`,
					api: 'default',
					MAX_AGE: 60 * 60 * 6, // 6h
					S_MAX_AGE: 60 * 60 * 12, // 12h
					STALE_WHILE_REVALIDATE: 60 * 20, // 20p
					STALE_IF_ERROR: 60 * 60 * 24 * 7, // 7day
				};
			}

			if (path === '/api/post') {
				const origin = getOrigin(url.host);
				const segment = url.searchParams.get('segment');
				const slug = url.searchParams.get('slug');

				return {
					key: `${origin}/${url.host}/${slug}.json`,
					api: segment,
					MAX_AGE: 60 * 60, // 1h
					S_MAX_AGE: 60 * 60 * 24 * 365, // 1year
					STALE_WHILE_REVALIDATE: 60 * 20, // 20p
					STALE_IF_ERROR: 60 * 60 * 24, // 1day
				};
			}

			// dynamic routes
			if (path.startsWith('/sitemap-post/') && path.endsWith('.xml')) {
				const match = path.match(/^\/sitemap-post\/([a-zA-Z0-9_-]+)\.xml$/);
				if (!match) return null; // reject invalid format
				const id = match[1];

				return {
					key: `${url.host}/sitemap-post/${id}.xml`,
					api: 'default',
					MAX_AGE: 60 * 60, // 1h
					S_MAX_AGE: 60 * 60 * 6, // 6h
					STALE_WHILE_REVALIDATE: 60 * 20, // 20p
					STALE_IF_ERROR: 60 * 60 * 24, // 1day
				};
			}

			return { key: null };
		}

		const { key, api, MAX_AGE, S_MAX_AGE, STALE_WHILE_REVALIDATE, STALE_IF_ERROR } = buildKey(url, path);

		if (!key) {
			return new Response('Not Found', {
				status: 404,
				headers: {
					'Cache-Control': 'public, max-age=600, s-maxage=1200',
				},
			});
		}

		console.log(`${endpoints[api]}/${key}`);
		let response = await fetch(`${endpoints[api]}/${key}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${env.SECRET_STORAGE_GENERAL}`,
			},
		});

		response = new Response(response.body, response);
		response.headers.set(
			'Cache-Control',
			`public, max-age=${MAX_AGE}, s-maxage=${S_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}, stale-if-error=${STALE_IF_ERROR}`,
		);

		return response;
	},
};
