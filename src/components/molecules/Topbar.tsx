import { appWindow } from "@tauri-apps/api/window";
import React from "react";

const Topbar: React.FunctionComponent = () => {
	return (
		<div
			className={`w-full h-8 bg-gray-800`}
			onMouseDown={() => {
				appWindow.startDragging();
			}}
		>
			<div className={`w-full h-full flex flex-shrink-0 flex-row-reverse justify-start items-center`}>
				<img className={`absolute w-auto h-8 top-0 left-0`} src="/favicon.png" />
			</div>
		</div>
	);
};

export default Topbar;
