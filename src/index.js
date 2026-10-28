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

			const { key, api, MAX_AGE = 0, S_MAX_AGE = 0, STALE_WHILE_REVALIDATE, STALE_IF_ERROR } = buildKey(url, path, routes);

			if (!key) {
				return new Response('Not Found', {
					status: 404,
					headers: {
						'Cache-Control': 'public, max-age=600, s-maxage=1200',
					},
				});
			}

			const target = `${endpoints[api]}/${key}`;

			console.log({
				request: request.url,
				hostname: url.host,
				path,
				api,
				key,
				target,
			});

			let response = await fetch(`${endpoints[api]}/${key}`, {
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

			if (protectedRoutes.has(path)) {
				if (!env.AES_SECRET_KEY) {
					console.error('AES_SECRET_KEY is missing');

					return new Response('Internal server error', {
						status: 500,
						headers: {
							'Cache-Control': 'no-store',
						},
					});
				}

				// let data;

				// try {
				// 	data = await response.json();
				// } catch (error) {
				// 	console.error('Invalid JSON from storage:', error);

				// 	return new Response('Invalid upstream response', {
				// 		status: 502,
				// 		headers: {
				// 			'Cache-Control': 'no-store',
				// 		},
				// 	});
				// }

				// const encrypted = await encryptPacket(data, env.AES_SECRET_KEY);

				// return new Response(encrypted, {
				// 	status: response.status,
				// 	headers: {
				// 		'Content-Type': 'text/plain; charset=utf-8',
				// 		'Cache-Control': `public, max-age=${MAX_AGE}, s-maxage=${S_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}, stale-if-error=${STALE_IF_ERROR}`,
				// 	},
				// });

				return new Response(response.body, {
					status: response.status,
					headers: {
						'Content-Type': response.headers.get('Content-Type') ?? 'text/plain; charset=utf-8',
						'Cache-Control': 'no-store',
					},
				});
			}

			response = new Response(response.body, response);

			response.headers.set(
				'Cache-Control',
				`public, max-age=${MAX_AGE}, s-maxage=${S_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}, stale-if-error=${STALE_IF_ERROR}`,
			);

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
