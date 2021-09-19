/**
 * Convert vertical field of view to horizontal field of view, given an aspect
 * ratio. See https://arstechnica.com/civis/viewtopic.php?f=6&t=37447
 *
 * @param vfov - The vertical field of view.
 * @param aspect - The aspect ratio, which is generally width/height of the viewport.
 * @returns - The horizontal field of view.
 */
const vfovToHfov = (vfov: number, aspect: number) => {
	return Math.atan(aspect * Math.tan(vfov / 2)) * 2;
};

/**
 * Get the distance from the camera to fit an object in view by either its
 * horizontal or its vertical dimension.
 *
 * @param size - This should be the width or height of the object to fit.
 * @param fov - If `size` is the object's width, `fov` should be the horizontal
 * field of view of the view camera. If `size` is the object's height, then
 * `fov` should be the view camera's vertical field of view.
 * @returns - The distance from the camera so that the object will fit from
 * edge to edge of the viewport.
 */
const _distanceToFitObjectInView = (size: number, fov: number) => {
	const { tan } = Math;
	return size / (2 * tan(fov / 2));
};

export const distanceToFitObjectToView = (
	cameraAspect: number,
	cameraVFov: number,
	objWidth: number,
	objHeight: number,
) => {
	const objAspect = objWidth / objHeight;
	const cameraHFov = vfovToHfov(cameraVFov, cameraAspect);

	let distance = 0;

	if (objAspect > cameraAspect) {
		distance = _distanceToFitObjectInView(objHeight, cameraVFov);
	} else if (objAspect <= cameraAspect) {
		distance = _distanceToFitObjectInView(objWidth, cameraHFov);
	}

	return distance;
};
