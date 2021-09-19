import { Group } from "three";
export declare function useBinaryFBX(path: { path: string; bufferPromise: Promise<ArrayBuffer> }): Group;
export declare namespace useBinaryFBX {
	const preload: (path: { path: string; bufferPromise: Promise<ArrayBuffer> }) => undefined;
	const clear: (input: string | string[]) => any;
}
