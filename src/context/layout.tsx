import React, { createContext, Dispatch, SetStateAction, useState } from "react";

const LayoutContext = createContext<{ navSize: number; setNavSize: Dispatch<SetStateAction<number>> }>(
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	null,
);

const LayoutProvider: React.FunctionComponent = (props) => {
	const [navSize, setNavSize] = useState(100);

	return <LayoutContext.Provider value={{ navSize, setNavSize }}>{props.children}</LayoutContext.Provider>;
};

export { LayoutProvider, LayoutContext };
