import { fs } from "@tauri-apps/api";
import React, { useContext, useEffect, useState } from "react";
import { LayoutContext } from "../../context/layout";
import { FSContext } from "../../context/fs";
import ResizePanel from "../atoms/ResizePanel";
import DirectorySelector from "../input/DirectorySelector";

const NavigationBar: React.FunctionComponent = () => {
	const { directoryPath, setDirectoryPath, selectedFilePath, setSelectedFilePath } = useContext(FSContext);
	const { navSize, setNavSize } = useContext(LayoutContext);
	const [files, setFiles] = useState<fs.FileEntry[]>([]);

	useEffect(() => {
		if (directoryPath === "") {
			return;
		}

		fs.readDir(directoryPath, { recursive: true }).then(setFiles);
	}, [directoryPath]);

	return (
		<div
			className={`relative z-0 text-white h-full bg-red-600 whitespace-nowrap overflow-hidden overflow-ellipsis flex flex-col`}
			style={{ width: `${navSize}px` }}
		>
			<DirectorySelector onUpdated={setDirectoryPath} value={directoryPath} />
			{files.map((fileEntry, index) => {
				return (
					<button
						key={fileEntry.name}
						onClick={() => {
							if (selectedFilePath === fileEntry.path) return;

							if (fileEntry.path.endsWith(".fbx") || fileEntry.path.endsWith(".gltf")) {
								setSelectedFilePath(fileEntry.path);
							}
						}}
					>
						{fileEntry.name}
					</button>
				);
			})}
			<ResizePanel direction={`e`} setSize={setNavSize} size={navSize} minSize={100}>
				<div className={`absolute bg-green-300 w-1 h-full top-0 right-0 cursor-e-resize`}></div>
			</ResizePanel>
		</div>
	);
};

export default NavigationBar;
