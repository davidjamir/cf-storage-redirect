function pemToArrayBuffer(pem) {
	const base64 = pem
		.replace(/-----BEGIN PUBLIC KEY-----/g, '')
		.replace(/-----END PUBLIC KEY-----/g, '')
		.replace(/\s/g, '');

	const binary = atob(base64);
	const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

	return bytes.buffer;
}

export function toBase64Url(bytes) {
	let binary = '';

	// Chuyển theo từng byte, tránh spread mảng lớn
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i]);
	}

	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export async function encryptPacket(payload, publicKeyPem) {
	try {
		console.log('[encryptPacket] Step 1: Importing public key');

		// 1. Import RSA public key
		const publicKey = await crypto.subtle.importKey(
			'spki',
			pemToArrayBuffer(publicKeyPem),
			{
				name: 'RSA-OAEP',
				hash: 'SHA-256',
			},
			false,
			['encrypt'],
		);

		console.log('[encryptPacket] Step 1: OK');

		console.log('[encryptPacket] Step 2: Encoding payload');

		// 2. Chuyển response thành JSON UTF-8

		const plaintext = new TextEncoder().encode(typeof payload === 'string' ? payload : JSON.stringify(payload));

		console.log('Payload bytes:', plaintext.byteLength);
		console.log('RSA modulus bits:', publicKey.algorithm.modulusLength);
		console.log('RSA hash:', publicKey.algorithm.hash.name);

		const encrypted = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, plaintext);

		console.log('[encryptPacket] Step 3: OK');
		console.log('[encryptPacket] Encrypted size:', encrypted.byteLength, 'bytes');

		console.log('[encryptPacket] Step 4: Encoding Base64URL');
		const result = toBase64Url(new Uint8Array(encrypted));
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
