import { Camera, EventDispatcher, Quaternion, Vector3 } from "three";

const twoPI = Math.PI * 2;
const halfPI = Math.PI / 2;

function contextmenu(event: Event): void {
	event.preventDefault();
}

const moduloWrapAround = (offset: number, capacity: number) => ((offset % capacity) + capacity) % capacity;

class FlyControls extends EventDispatcher {
	public object: Camera;
	public domElement: HTMLCanvasElement;

	public movementSpeed = 1.0;
	public rotateSpeed = 0.005;

	public dragToLook = true;
	public autoForward = false;

	private changeEvent = { type: "change" };
	private EPS = 0.000001;

	private theta = 0;
	private phi = 0;
	private dTheta = 0;
	private dPhi = 0;

	//vertical orbit
	minPolarAngle = -halfPI;
	maxPolarAngle = halfPI;
	//horizontal orbit
	minAzimuthAngle = -Infinity;
	maxAzimuthAngle = Infinity;

	private movementSpeedMultiplier = 1;

	private moveState = {
		up: 0,
		down: 0,
		left: 0,
		right: 0,
		forward: 0,
		back: 0,
		pitchUp: 0,
		pitchDown: 0,
		yawLeft: 0,
		yawRight: 0,
	};
	private moveVector = new Vector3(0, 0, 0);

	constructor(object: Camera, domElement: HTMLCanvasElement) {
		super();

		this.object = object;
		this.domElement = domElement;

		if (domElement && !(domElement instanceof Document)) {
			domElement.setAttribute("tabindex", -1 as any);
		}

		this.domElement.addEventListener("contextmenu", contextmenu);
		(this.domElement as HTMLElement).addEventListener("mousemove", this.mousemove);
		(this.domElement as HTMLElement).addEventListener("mousedown", this.mousedown);
		(this.domElement as HTMLElement).addEventListener("mouseup", this.mouseup);
		(this.domElement as HTMLElement).addEventListener("mouseleave", this.mouseup);
		(this.domElement as HTMLElement).addEventListener("wheel", this.wheel);

		window.addEventListener("keydown", this.keydown);
		window.addEventListener("keyup", this.keyup);

		this.updateMovementVector();
		this.updateRotationVector();
	}

	public getPolarAngle = () => this.phi;
	public getAzimuthalAngle = () => this.theta;
	public setPolarAngle = (value: number) => {
		// use modulo wrapping to safeguard value
		let phi = moduloWrapAround(value, 2 * Math.PI);
		let currentPhi = this.phi;

		// convert to the equivalent shortest angle
		if (currentPhi < 0) currentPhi += 2 * Math.PI;
		if (phi < 0) phi += 2 * Math.PI;
		let phiDist = Math.abs(phi - currentPhi);
		if (2 * Math.PI - phiDist < phiDist) {
			if (phi < currentPhi) {
				phi += 2 * Math.PI;
			} else {
				currentPhi += 2 * Math.PI;
			}
		}
		this.dPhi = phi - currentPhi;
		this.update(0);
	};
	public setAzimuthalAngle = (value: number) => {
		let theta = moduloWrapAround(value, 2 * Math.PI);
		let currentTheta = this.theta;

		// convert to the equivalent shortest angle
		if (currentTheta < 0) currentTheta += 2 * Math.PI;
		if (theta < 0) theta += 2 * Math.PI;
		let thetaDist = Math.abs(theta - currentTheta);
		if (2 * Math.PI - thetaDist < thetaDist) {
			if (theta < currentTheta) {
				theta += 2 * Math.PI;
			} else {
				currentTheta += 2 * Math.PI;
			}
		}
		this.dTheta = theta - currentTheta;
		this.update(0);
	};

	private wheel = (event: WheelEvent): void => {
		//forward -,back +

		event.preventDefault();
		this.object.translateZ(Math.sign(event.deltaY) * 0.3 * this.movementSpeed);
	};

	private keydown = (event: KeyboardEvent): void => {
		if (event.altKey) {
			return;
		}

		switch (event.code) {
			case "ShiftLeft":
			case "ShiftRight":
				this.movementSpeedMultiplier = 0.1;
				break;

			case "KeyW":
				this.moveState.forward = 1;
				break;
			case "KeyS":
				this.moveState.back = 1;
				break;

			case "KeyA":
				this.moveState.left = 1;
				break;
			case "KeyD":
				this.moveState.right = 1;
				break;

			case "ArrowUp":
				this.moveState.pitchUp = 1;
				break;
			case "ArrowDown":
				this.moveState.pitchDown = 1;
				break;

			case "ArrowLeft":
				this.moveState.yawLeft = 1;
				break;
			case "ArrowRight":
				this.moveState.yawRight = 1;
				break;

			case "KeyQ":
				this.moveState.down = 1;
				break;
			case "KeyE":
				this.moveState.up = 1;
				break;
		}

		this.updateMovementVector();
		this.updateRotationVector();
	};

	private keyup = (event: KeyboardEvent): void => {
		switch (event.code) {
			case "ShiftLeft":
			case "ShiftRight":
				this.movementSpeedMultiplier = 1;
				break;

			case "KeyW":
				this.moveState.forward = 0;
				break;
			case "KeyS":
				this.moveState.back = 0;
				break;

			case "KeyA":
				this.moveState.left = 0;
				break;
			case "KeyD":
				this.moveState.right = 0;
				break;

			case "ArrowUp":
				this.moveState.pitchUp = 0;
				break;
			case "ArrowDown":
				this.moveState.pitchDown = 0;
				break;

			case "ArrowLeft":
				this.moveState.yawLeft = 0;
				break;
			case "ArrowRight":
				this.moveState.yawRight = 0;
				break;

			case "KeyQ":
				this.moveState.down = 0;
				break;
			case "KeyE":
				this.moveState.up = 0;
				break;
		}

		this.updateMovementVector();
		this.updateRotationVector();
	};

	private isMouseDown = false;
	private mousedown = (event: MouseEvent): void => {
		if (event.button === 2) {
			this.isMouseDown = true;

			if (this.dragToLook) {
				this.domElement.requestPointerLock();
			} else {
				/**switch (event.button) {
					case 0:
						this.moveState.forward = 1;
						break;
					case 2:
						this.moveState.back = 1;
						break;
				}

				this.updateMovementVector();*/
			}
		}
	};

	private mousemove = (event: MouseEvent): void => {
		if (this.isMouseDown || !this.dragToLook) {
			this.theta -= (twoPI * event.movementX) / this.domElement.clientHeight;
			this.phi -= (twoPI * event.movementY) / this.domElement.clientHeight;

			this.updateRotationVector();
		}
	};

	private mouseup = (event: MouseEvent): void => {
		if (event.button === 2) {
			this.isMouseDown = false;

			if (this.dragToLook) {
				this.moveState.yawLeft = this.moveState.pitchDown = 0;
				document.exitPointerLock();
			} else {
				/**switch (event.button) {
					case 0:
						this.moveState.forward = 0;
						break;
					case 2:
						this.moveState.back = 0;
						break;
				}

				this.updateMovementVector();*/
			}

			this.updateRotationVector();
		}
	};

	private lastQuaternion = new Quaternion();
	private lastPosition = new Vector3();

	public update = (delta: number): void => {
		this.theta += this.dTheta;
		this.phi += this.dPhi;

		let min = this.minAzimuthAngle;
		let max = this.maxAzimuthAngle;
		if (isFinite(min) && isFinite(max)) {
			if (min < -Math.PI) min += twoPI;
			else if (min > Math.PI) min -= twoPI;

			if (max < -Math.PI) max += twoPI;
			else if (max > Math.PI) max -= twoPI;

			if (min <= max) {
				this.theta = Math.max(min, Math.min(max, this.theta));
			} else {
				this.theta = this.theta > (min + max) / 2 ? Math.max(min, this.theta) : Math.min(max, this.theta);
			}
		}

		this.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.phi));
		this.phi = (this.phi + twoPI) % twoPI;
		if (this.phi > halfPI) {
			this.phi -= twoPI;
		}

		const moveMult = delta * this.movementSpeed * this.movementSpeedMultiplier;

		this.object.translateX(this.moveVector.x * moveMult);
		this.object.translateY(this.moveVector.y * moveMult);
		this.object.translateZ(this.moveVector.z * moveMult);

		this.object.rotation.set(this.phi, this.theta, 0, "ZYX");

		if (
			this.lastPosition.distanceToSquared(this.object.position) > this.EPS ||
			8 * (1 - this.lastQuaternion.dot(this.object.quaternion)) > this.EPS
		) {
			this.dispatchEvent(this.changeEvent);
			this.lastQuaternion.copy(this.object.quaternion);
			this.lastPosition.copy(this.object.position);
		}
	};

	private updateMovementVector = (): void => {
		const forward = this.moveState.forward || (this.autoForward && !this.moveState.back) ? 1 : 0;

		this.moveVector.x = -this.moveState.left + this.moveState.right;
		this.moveVector.y = -this.moveState.down + this.moveState.up;
		this.moveVector.z = -forward + this.moveState.back;
	};

	private updateRotationVector = (): void => {
		const x = -this.moveState.pitchDown + this.moveState.pitchUp;
		const y = -this.moveState.yawRight + this.moveState.yawLeft;

		this.dTheta = ((twoPI * y) / this.domElement.clientHeight) * this.rotateSpeed;
		this.dPhi = ((twoPI * x) / this.domElement.clientHeight) * this.rotateSpeed;
	};

	private getContainerDimensions = (): {
		size: number[];
		offset: number[];
	} => {
		if (this.domElement != document && !(this.domElement instanceof Document)) {
			const rectObject = this.domElement.getBoundingClientRect();
			return {
				size: [rectObject.width, rectObject.height],
				offset: [rectObject.x, rectObject.y],
			};
		} else {
			return {
				size: [window.innerWidth, window.innerHeight],
				offset: [0, 0],
			};
		}
	};

	public dispose = (): void => {
		this.domElement.removeEventListener("contextmenu", contextmenu);
		(this.domElement as HTMLElement).removeEventListener("mousemove", this.mousemove);
		(this.domElement as HTMLElement).removeEventListener("mousedown", this.mousedown);
		(this.domElement as HTMLElement).removeEventListener("mouseup", this.mouseup);
		(this.domElement as HTMLElement).removeEventListener("mouseleave", this.mouseup);
		(this.domElement as HTMLElement).removeEventListener("wheel", this.wheel);

		window.removeEventListener("keydown", this.keydown);
		window.removeEventListener("keyup", this.keyup);
	};
}

export { FlyControls };
