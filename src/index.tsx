import ReactDOM from "react-dom";
import React, { useContext } from "react";
import Topbar from "./components/molecules/Topbar";
import { FSContext, FSProvider } from "./context/fs";
import NavigationBar from "./components/molecules/NavigationBar";
import { LayoutContext, LayoutProvider } from "./context/layout";
import CanvasView from "./components/molecules/CanvasView";

const Root = () => {
	const { navSize } = useContext(LayoutContext);
	const { selectedFilePath } = useContext(FSContext);

	return (
		<>
			<Topbar />
			<div className={`w-full h-body flex flex-row`}>
				<NavigationBar />
				<div
					className={`relative z-50 h-full`}
					style={{ width: `calc(100% - ${navSize}px)`, color: "#FFFFFF" }}
				>
					<CanvasView filePath={selectedFilePath} />
				</div>
			</div>
		</>
	);
};

ReactDOM.render(
	<FSProvider>
		<LayoutProvider>
			<Root />
		</LayoutProvider>
	</FSProvider>,
	document.getElementById("root"),
);

if (import.meta.hot) {
	import.meta.hot.accept();
}
