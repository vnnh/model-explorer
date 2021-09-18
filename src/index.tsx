/* eslint-disable @typescript-eslint/ban-ts-comment */
import ReactDOM from "react-dom";
import { Environment, FlyControls, Html, useGLTF, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import Topbar from "./components/Topbar";
import DirectorySelector from "./components/input/DirectorySelector";
import "./root.css";

const Scene = () => {
	const gltf = useGLTF("/scene.gltf");

	return (
		<>
			<primitive object={gltf.scene.children[0]} />
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
		<DirectorySelector />
		<div className={`fullscreen-model-view`} style={{ color: "#FFFFFF" }}>
			<Canvas frameloop={"always"}>
				<Suspense fallback={<Loader />}>
					<Scene />
				</Suspense>
			</Canvas>
		</div>
	</>,
	document.getElementById("root"),
);

if (import.meta.hot) {
	import.meta.hot.accept();
}
