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

	// 2. Chuyển response thành JSON UTF-8

	const plaintext = new TextEncoder().encode(typeof payload === 'string' ? payload : JSON.stringify(payload));

	const encrypted = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, plaintext);

	return toBase64Url(new Uint8Array(encrypted));
}
