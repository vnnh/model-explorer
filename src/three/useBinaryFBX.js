import { BinaryFBXLoader } from "./BinaryFBXLoader";
import { useFileLoader } from "./useFileLoader";

function useBinaryFBX(path) {
	return useFileLoader(BinaryFBXLoader, path);
}

useBinaryFBX.preload = (path) => useFileLoader.preload(BinaryFBXLoader, path); // @ts-expect-error new in r3f 7.0.5

useBinaryFBX.clear = (input) => useFileLoader.clear(BinaryFBXLoader, input);

export { useBinaryFBX };
