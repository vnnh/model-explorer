import { useFileAsset } from "./useFileAsset";

function buildGraph(object) {
	const data = {
		nodes: {},
		materials: {},
	};

	if (object) {
		object.traverse((obj) => {
			if (obj.name) {
				data.nodes[obj.name] = obj;
			}

			if (obj.material && !data.materials[obj.material.name]) {
				data.materials[obj.material.name] = obj.material;
			}
		});
	}

	return data;
}

function loadingFn(extensions, onProgress) {
	return function (Proto, ...input) {
		// Construct new loader and run extensions
		const loader = new Proto();
		if (extensions) extensions(loader); // Go through the urls and load them

		return Promise.all(
			input.map(
				(input) =>
					new Promise((res, reject) =>
						loader.load(
							input,
							(data) => {
								if (data.scene) Object.assign(data, buildGraph(data.scene));
								res(data);
							},
							onProgress,
							(error) => reject(`Could not load ${input}: ${error.message}`),
						),
					),
			),
		);
	};
}

function useFileLoader(Proto, input, extensions, onProgress) {
	// Use suspense to load async assets
	const keys = Array.isArray(input) ? input : [input];
	const results = useFileAsset(loadingFn(extensions, onProgress), Proto, input); // Return the object/s

	return Array.isArray(input) ? results : results[0];
}

useFileLoader.preload = function (Proto, input, extensions) {
	const keys = Array.isArray(input) ? input : [input];
	return useFileAsset.preload(loadingFn(extensions), Proto, ...keys);
};

useFileLoader.clear = function (Proto, input) {
	const keys = Array.isArray(input) ? input : [input];
	return useFileAsset.clear(Proto, ...keys);
};

export { useFileLoader };
