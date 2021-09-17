import { dialog } from "@tauri-apps/api";
import React, { useState } from "react";
import "./input.css";

const DirectorySelector = (): React.ReactElement => {
	const [directoryPath, setDirectoryPath] = useState("");

	return (
		<div className={`directory-selector-container`}>
			<button
				onClick={() => {
					dialog.open({ multiple: false, directory: true }).then((value) => {
						if (value == undefined) {
							return;
						}

						setDirectoryPath(typeof value === "string" ? value : value[0]);
					});
				}}
			>
				choose file
			</button>
			{directoryPath}
		</div>
	);
};

export default DirectorySelector;
