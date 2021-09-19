export declare function useFileLoader<T, U extends string | string[]>(
	Proto: new () => LoaderResult<T>,
	input: U,
	extensions?: Extensions,
	onProgress?: (event: ProgressEvent<EventTarget>) => void,
): U extends any[] ? BranchingReturn<T, GLTF, GLTF & ObjectMap>[] : BranchingReturn<T, GLTF, GLTF & ObjectMap>;
export declare namespace useFileLoader {
	const preload: <T, U extends string | string[]>(
		Proto: new () => LoaderResult<T>,
		input: U,
		extensions?: Extensions | undefined,
	) => undefined;
	const clear: <T, U extends string | string[]>(Proto: new () => LoaderResult<T>, input: U) => void;
}
