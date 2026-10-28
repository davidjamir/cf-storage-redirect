function toBase64Url(bytes) {
	let binary = '';
	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}

	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export async function encryptPacket(payload, secretKey) {
	try {
		console.log('[encryptPacket] Step 1: Importing public key');

		const keyBytes = Uint8Array.from(atob(secretKey), (c) => c.charCodeAt(0));
		const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['encrypt']);

		console.log('[encryptPacket] Step 1: OK');

		console.log('[encryptPacket] Step 2: Encoding payload');

		// 2. Chuyển response thành JSON UTF-8

		const plaintext = new TextEncoder().encode(typeof payload === 'string' ? payload : JSON.stringify(payload));

		console.log('Payload bytes:', plaintext.byteLength);
		const iv = crypto.getRandomValues(new Uint8Array(12));
		const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);
		console.log('[encryptPacket] Step 3: OK');
		console.log('[encryptPacket] Encrypted size:', encrypted.byteLength, 'bytes');

		console.log('[encryptPacket] Step 4: Encoding Base64URL');
		// const result = toBase64Url(new Uint8Array(encrypted));
		const result = toBase64Url(new Uint8Array(plaintext));
		console.log('[encryptPacket] Step 4: OK');

		return result;
	} catch (error) {
		console.error('[encryptPacket] Failed:', {
			name: error?.name,
			message: error?.message,
			stack: error?.stack,
		});

		throw error;
	}
}
