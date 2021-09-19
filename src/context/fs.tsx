import React, { createContext, Dispatch, SetStateAction, useState } from "react";

const FSContext = createContext<{
	directoryPath: string;
	setDirectoryPath: Dispatch<SetStateAction<string>>;
	selectedFilePath: string;
	setSelectedFilePath: Dispatch<SetStateAction<string>>;
}>(
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	null,
);

const FSProvider: React.FunctionComponent = (props) => {
	const [directoryPath, setDirectoryPath] = useState("");
	const [selectedFilePath, setSelectedFilePath] = useState("");

	return (
		<FSContext.Provider value={{ directoryPath, setDirectoryPath, selectedFilePath, setSelectedFilePath }}>
			{props.children}
		</FSContext.Provider>
	);
};

export { FSProvider, FSContext };
