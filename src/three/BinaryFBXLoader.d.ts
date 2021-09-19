import { Group, Loader, LoadingManager } from "three";

export class BinaryFBXLoader extends Loader {
	constructor(manager?: LoadingManager);

	load(
		url: { path: string; bufferPromise: Promise<ArrayBuffer> },
		onLoad: (object: Group) => void,
		onProgress?: (event: ProgressEvent) => void,
		onError?: (event: ErrorEvent) => void,
	): void;
	loadAsync(
		url: { path: string; bufferPromise: Promise<ArrayBuffer> },
		onProgress?: (event: ProgressEvent) => void,
	): Promise<Group>;
	parse(FBXBuffer: ArrayBuffer | string, path: string): Group;
}
