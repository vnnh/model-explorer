import ReactDOM from "react-dom";
import { Environment, FlyControls, Html, useGLTF, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import Topbar from "./components/Topbar";

const Scene = () => {
	//const gltf = useGLTF("/scene.gltf");
	//<primitive object={gltf.scene.children[0]} />

	return (
		<>
			<FlyControls movementSpeed={5} rollSpeed={Math.PI / 3} autoForward={false} dragToLook={true} />
			<ambientLight intensity={0.5}></ambientLight>
			<Environment preset={"forest"} background />
		</>
	);
};

const Loader = () => {
	const { progress } = useProgress();

	return <Html center>{progress} % loaded</Html>;
};

ReactDOM.render(
	<>
		<Topbar />
		<div className={`fullscreen-model-view`}>
			<Canvas frameloop={"always"}>
				<Suspense fallback={<Loader />}>
					<Scene />
				</Suspense>
			</Canvas>
		</div>
	</>,
	document.getElementById("root"),
);
