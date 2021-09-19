import React from "react";
import { DraggableCore } from "react-draggable";

interface ResizePanelProps {
	size: number;
	minSize: number;
	setSize: (size: number) => void;
	direction: "n" | "e" | "s" | "w";
}

const ResizePanel: React.FunctionComponent<ResizePanelProps> = (props) => {
	const isHorizontal = props.direction === "w" || props.direction === "e";

	return (
		<DraggableCore
			key={`DragHandle`}
			onDrag={(e, ui) => {
				const factor = props.direction === "e" || props.direction === "s" ? -1 : 1;

				const delta = isHorizontal ? ui.deltaX : ui.deltaY;
				props.setSize(Math.max(props.minSize, props.size - delta * factor));
			}}
		>
			{props.children}
		</DraggableCore>
	);
};

export default ResizePanel;
