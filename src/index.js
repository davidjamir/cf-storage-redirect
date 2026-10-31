import { protectedRoutes, endpoints, routes } from './data';
import { encryptPacket } from '../helper/crypto';
import { buildKey } from '../helper/action';

export default {
	async fetch(request, env) {
		try {
			const url = new URL(request.url);
			const path = url.pathname;

			if (!path || path === '/') {
				return new Response('Not Found', {
					status: 404,
					headers: {
						'Cache-Control': 'public, max-age=600, s-maxage=1200',
					},
				});
			}

			endpoints.default = env.ENDPOINT_STORAGE_GENERAL;

			const { key, api, MAX_AGE = 0, S_MAX_AGE = 0, STALE_WHILE_REVALIDATE = 0, STALE_IF_ERROR = 0 } = buildKey(url, path, routes);

			if (!key) {
				return new Response('Not Found', {
					status: 404,
					headers: {
						'Cache-Control': 'public, max-age=600, s-maxage=1200',
					},
				});
			}

			const target = `${endpoints[api]}/${key}`;

			let response = await fetch(target, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${env.SECRET_STORAGE_GENERAL}`,
				},
			});

			if (!response.ok) {
				console.error('Storage upstream error:', response.status);

				return new Response('Upstream error', {
					status: 502,
					headers: {
						'Cache-Control': 'no-store',
					},
				});
			}

			const cacheControl =
				!MAX_AGE && !S_MAX_AGE
					? 'no-store'
					: `public, max-age=${MAX_AGE}, s-maxage=${S_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}, stale-if-error=${STALE_IF_ERROR}`;

			if (protectedRoutes.has(path) && env.IS_CRYPTO_PAYLOAD) {
				if (!env.AES_SECRET_KEY) {
					console.error('AES_SECRET_KEY is missing');

					return new Response('Internal server error', {
						status: 500,
						headers: {
							'Cache-Control': 'no-store',
						},
					});
				}

				let data;

				try {
					data = await response.json();
				} catch (error) {
					console.error('Invalid JSON from storage:', error);

					return new Response('Invalid upstream response', {
						status: 502,
						headers: {
							'Cache-Control': 'no-store',
						},
					});
				}

				const encrypted = await encryptPacket(data, env.AES_SECRET_KEY);

				return new Response(encrypted, {
					status: response.status,
					headers: {
						'Content-Type': 'text/plain; charset=utf-8',
						'Cache-Control': cacheControl,
					},
				});
			}

			response = new Response(response.body, response);

			response.headers.set('Cache-Control', cacheControl);

			return response;
		} catch (error) {
			console.error('Worker error:', error);

			return new Response('Internal server error', {
				status: 500,
				headers: {
					'Cache-Control': 'no-store',
				},
			});
		}
	},
};
