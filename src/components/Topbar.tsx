import { appWindow } from "@tauri-apps/api/window";
import React from "react";
import "../root.css";

const Topbar = (): JSX.Element => {
	return (
		<div
			className={`title-div`}
			onMouseDown={() => {
				appWindow.startDragging();
			}}
		>
			<div className={`right-title-container`}>
				<img className={`title-image`} src="/favicon.png" />
			</div>
		</div>
	);
};

export default Topbar;
