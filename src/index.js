import { protectedRoutes, endpoints, routes } from './data';
import { buildKey } from '../helper/action';

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

		endpoints.default = env.ENDPOINT_STORAGE_GENERAL;

		const { key, api, MAX_AGE, S_MAX_AGE, STALE_WHILE_REVALIDATE, STALE_IF_ERROR } = buildKey(url, path, routes);

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
