export function getOrigin(hostname) {
	const parts = hostname.split('.');
	if (parts.length <= 2) return hostname;
	return parts.slice(-2).join('.');
}

export function buildKey(url, path, routes) {
	const origin = getOrigin(url.host);

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
			key: `${origin}/${url.host}/${routes[path]}`,
			api: 'default',
			MAX_AGE: 60 * 60 * 12, // 12h
			S_MAX_AGE: 60 * 60 * 24, // 1day
			STALE_WHILE_REVALIDATE: 60 * 20, // 20p
			STALE_IF_ERROR: 60 * 60 * 24, // 1day
		};
	}
	if (path === '/robots.txt') {
		return {
			key: `${origin}/${url.host}/${routes[path]}`,
			api: 'default',
			MAX_AGE: 60 * 60 * 24, // 1day
			S_MAX_AGE: 60 * 60 * 24 * 365, // 1year
			STALE_WHILE_REVALIDATE: 60 * 60, // 1h
			STALE_IF_ERROR: 60 * 60 * 24, // 1day
		};
	}
	if (path === '/api/site') {
		return {
			key: `${origin}/${url.host}/${routes[path]}`,
			api: 'default',
			MAX_AGE: 60 * 60 * 12, // 12h
			S_MAX_AGE: 60 * 60 * 24, // 1day
			STALE_WHILE_REVALIDATE: 60 * 20, // 20p
			STALE_IF_ERROR: 60 * 60 * 24 * 7, // 7day
		};
	}
	if (path === '/api/latest') {
		return {
			key: `${origin}/${url.host}/${routes[path]}`,
			api: 'default',
			MAX_AGE: 60 * 60 * 6, // 6h
			S_MAX_AGE: 60 * 60 * 12, // 12h
			STALE_WHILE_REVALIDATE: 60 * 20, // 20p
			STALE_IF_ERROR: 60 * 60 * 24 * 7, // 7day
		};
	}

	if (path === '/api/post') {
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
			key: `${origin}/${url.host}/sitemap-post/${id}.xml`,
			api: 'default',
			MAX_AGE: 60 * 60, // 1h
			S_MAX_AGE: 60 * 60 * 6, // 6h
			STALE_WHILE_REVALIDATE: 60 * 20, // 20p
			STALE_IF_ERROR: 60 * 60 * 24, // 1day
		};
	}

	return { key: null };
}
