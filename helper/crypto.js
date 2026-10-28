function toBase64Url(bytes) {
	let binary = '';
	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}

	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export async function encryptPacket(payload, secretKey) {
	try {
		const keyBytes = Uint8Array.from(atob(secretKey), (c) => c.charCodeAt(0));
		const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['encrypt']);

		//  Chuyển response thành JSON UTF-8
		const plaintext = new TextEncoder().encode(typeof payload === 'string' ? JSON.stringify(JSON.parse(payload)) : JSON.stringify(payload));

		const iv = crypto.getRandomValues(new Uint8Array(12));
		const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);

		const result = new Uint8Array(iv.length + encrypted.byteLength);
		result.set(iv, 0);
		result.set(new Uint8Array(encrypted), iv.length);

		return toBase64Url(result);
	} catch (error) {
		console.error('[encryptPacket] Failed:', {
			name: error?.name,
			message: error?.message,
			stack: error?.stack,
		});

		throw error;
	}
}
