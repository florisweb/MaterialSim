import Vector from './vector.js';


export default class Spring {
	targetLength = 5;
	springConstant = 200;
	nodeA;
	nodeB;

	get position() {
		return this.nodeA.position;
	}
	get delta() {
		return this.nodeA.position.difference(this.nodeB.position);
	}

	get energy() {
		let deltaLength = this.delta.length - this.targetLength;
		return this.springConstant * deltaLength**2;
	}

	constructor(_nodeA, _nodeB, _config) {
		this.nodeA = _nodeA;
		this.nodeB = _nodeB;
		this.targetLength = _config?.targetLength || this.targetLength;
		this.springConstant = _config?.springConstant || this.springConstant;
	}
}