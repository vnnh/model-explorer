import { dialog } from "@tauri-apps/api";
import React from "react";

const DirectorySelector = (props: {
	value: string;
	onUpdated: (directoryPath: string) => void;
}): React.ReactElement => {
	return (
		<div className={`flex flex-row text-gray-100`}>
			<button
				onClick={() => {
					dialog.open({ multiple: false, directory: true }).then((value) => {
						if (value == undefined) {
							return;
						}

						props.onUpdated(typeof value === "string" ? value : value[0]);
					});
				}}
			>
				choose file
			</button>
			{props.value}
		</div>
	);
};

export default DirectorySelector;
