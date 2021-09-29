import { useGLTF, Loader } from "@react-three/drei";
import { Canvas, extend, useThree } from "@react-three/fiber";
import { fs } from "@tauri-apps/api";
import React, { Suspense, useEffect } from "react";
import { byteToArrayBuffer } from "src/util/byteToArrayBuffer";
import { useBinaryFBX } from "src/three/useBinaryFBX";
import * as THREE from "three";
import { MeshPhongMaterial, Vector3 } from "three";
import { FlyControls } from "src/three/controls/FlyControls";
import { usePrevious } from "src/util/usePrevious";
import { Lightmap } from "src/three/Lightmap";
import { useControls } from "leva";
import { Debug, Physics, useCylinder, usePlane } from "@react-three/cannon";
import { DragControls } from "three/examples/jsm/controls/DragControls";

extend({ DragControls });

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace JSX {
		interface IntrinsicElements {
			dragControls: any;
		}
	}
}

const gridMaterial = new MeshPhongMaterial({ opacity: 0.2, transparent: true });
const BaseScene: React.FunctionComponent = () => {
	const [ref, api] = usePlane(() => ({
		rotation: [-Math.PI / 2, 0, 0],
	}));
	return (
		<>
			<mesh
				ref={ref}
				scale={1000}
				rotation={[-Math.PI / 2, 0, 0]}
				position={[0, 0, 0]}
				castShadow={true}
				receiveShadow={true}
				frustumCulled={false}
			>
				<planeGeometry />
				<meshPhongMaterial args={[{ color: "#c0c0c0" }]} />
			</mesh>
			<gridHelper args={[1000, 20, 0x000000, 0x000000]} material={gridMaterial} />
		</>
	);
};

const FBXScene: React.FunctionComponent<{ filePath: string }> = (props) => {
	const camera = useThree((state) => state.camera);
	const gl = useThree((state) => state.gl);

	const fbx = useBinaryFBX({
		bufferPromise: fs.readBinaryFile(props.filePath).then((value) => {
			return byteToArrayBuffer(value);
		}),
		path: props.filePath,
	});
	fbx.name = props.filePath;

	const previousFilePath = usePrevious(props.filePath);
	useEffect(() => {
		if (previousFilePath && previousFilePath !== props.filePath) {
			useBinaryFBX.clear([previousFilePath]);
		}
	}, [props.filePath]);

	let box3 = new THREE.Box3().setFromObject(fbx);
	const size = new THREE.Vector3();
	box3.getSize(size);

	fbx.scale.multiplyScalar(10 / Math.max(size.x, size.y, size.z));
	box3 = new THREE.Box3().setFromObject(fbx);
	box3.getSize(size);

	fbx.position.set(0, Math.max(size.y / 2, 1), 0);
	fbx.rotation.set(0, 0, 0);

	const [ref, api] = useCylinder(() => ({
		mass: 1,
		position: [0, 2, 0],
	}));
	return (
		<>
			<group ref={ref}>
				<primitive object={fbx} />
			</group>
			<dragControls enabled transformGroup args={[[fbx], camera, gl.domElement]} />
		</>
	);
};

const Scene: React.FunctionComponent<{ filePath: string }> = (props) => {
	const lightmapProps = useControls({
		intensity: { value: 1, min: 0, max: 1, step: 0.1 },
		ambient: { value: 0.5, min: 0, max: 1, step: 0.1 },
		radius: { value: 25, min: 0, max: 100, step: 1 },
		blend: { value: 40, min: 1, max: 200, step: 1 },
	});

	if (props.filePath === "")
		return (
			<Lightmap {...lightmapProps}>
				<BaseScene />
			</Lightmap>
		);

	if (props.filePath.endsWith(".fbx")) {
		return (
			<Lightmap {...lightmapProps}>
				<FBXScene key={props.filePath} filePath={props.filePath} />
				<BaseScene />
			</Lightmap>
		);
	} else {
		const gltf = useGLTF("/scene.gltf");

		return (
			<Lightmap {...lightmapProps}>
				<primitive object={gltf.scene.children[0]} />
				<BaseScene />
			</Lightmap>
		);
	}
};

class CanvasView extends React.PureComponent<{ filePath: string }> {
	render() {
		return (
			<>
				<Canvas
					frameloop={"always"}
					camera={{ position: new Vector3(0, 2, 10) }}
					shadows
					dpr={[1, 1.5]}
					gl={{ alpha: false }}
				>
					<color attach={`background`} args={["#d0d0d0"]}></color>
					<fog attach="fog" args={["#d0d0d0", 100, 600]} />
					<FlyControls movementSpeed={5} rotateSpeed={Math.PI / 8} autoForward={false} dragToLook={true} />
					<Suspense fallback={null}>
						<Physics iterations={15} gravity={[0, -200, 0]} allowSleep={false}>
							<Debug>
								<Scene filePath={this.props.filePath} />
							</Debug>
						</Physics>
					</Suspense>
				</Canvas>
				<Loader />
			</>
		);
	}
}

export default CanvasView;
