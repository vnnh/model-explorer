/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as THREE from "three";
import React, { useLayoutEffect, useRef, useMemo } from "react";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { ProgressiveLightMap } from "three/examples/jsm/misc/ProgressiveLightMap";
import { Group } from "three";

extend({ ProgressiveLightMap });

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace JSX {
		interface IntrinsicElements {
			progressiveLightMap: any;
		}
	}
}

const Lightmap: React.FunctionComponent<{
	position?: [number, number, number];
	resolution?: number;
	intensity?: number;
	ambient?: number;
	radius?: number;
	blend?: number;
	lights?: number;
}> = ({
	children,
	position = [50, 150, 50],
	resolution = 1024,
	intensity = 1,
	ambient = 0.5,
	radius = 40,
	blend = 40,
	lights = 10,
}) => {
	const rGroup = useRef<Group>();
	const rLightmap = useRef<ProgressiveLightMap>();
	const gl = useThree((state) => state.gl);
	const camera = useThree((state) => state.camera);
	const dirLights = useMemo(
		() =>
			[...Array(lights)].map((_, i) => {
				let dirLight = new THREE.DirectionalLight(0xffffff, intensity / lights);
				dirLight.castShadow = true;
				dirLight.shadow.camera.near = 100;
				dirLight.shadow.camera.far = 5000;
				dirLight.shadow.camera.right = dirLight.shadow.camera.top = 150;
				dirLight.shadow.camera.left = dirLight.shadow.camera.bottom = -150;
				dirLight.shadow.mapSize.width = dirLight.shadow.mapSize.height = resolution / 2;
				return dirLight;
			}),
		[intensity, lights, resolution],
	);

	useLayoutEffect(() => {
		const lightmap = rLightmap.current;
		const objects = [...dirLights];

		//@ts-ignore
		rGroup.current?.traverse((child) => child.isMesh && objects.push(child));

		lightmap?.addObjectsToLightMap(objects);
		return () => {
			if (lightmap) {
				//@ts-ignore
				lightmap.blurringPlane = null;
				lightmap.lightMapContainers = [];
				lightmap.compiled = false;
				lightmap.scene.clear();
			}
		};
	}, [children]);

	useFrame(() => {
		rLightmap.current?.update(camera, blend, true);
		for (let l = 0; l < dirLights.length; l++) {
			if (Math.random() > ambient)
				dirLights[l].position.set(
					position[0] + Math.random() * radius,
					position[1] + Math.random() * radius,
					position[2] + Math.random() * radius,
				);
			else {
				let lambda = Math.acos(2 * Math.random() - 1) - Math.PI / 2.0;
				let phi = 2 * Math.PI * Math.random();
				dirLights[l].position.set(
					Math.cos(lambda) * Math.cos(phi) * 300,
					Math.abs(Math.cos(lambda) * Math.sin(phi) * 300),
					Math.sin(lambda) * 300,
				);
			}
		}
	});

	return (
		<>
			<progressiveLightMap ref={rLightmap} args={[gl, resolution]} />
			<group ref={rGroup}>{children}</group>
		</>
	);
};

export { Lightmap };
