export const byteToArrayBuffer = (byteArray: number[]): ArrayBuffer => {
	const uint8Array = new Uint8Array(byteArray.length);
	for (let i = 0; i < uint8Array.length; i++) {
		uint8Array[i] = byteArray[i];
	}

	return uint8Array.buffer;
};
