import Vector from './vector.js';
import Spring from './spring.js';

export default class Node {
	springs = [];
	position = new Vector(0, 0);
	isFixed = false;

	get id() {
		return this.position.value.join('') + this.isFixed + this.springs.length;
	}
	get energy() {
		let springEnergy = this.springs.filter(spring => spring.nodeA === this).map(spring => spring.energy).reduce((a, b) => a + b, 0);
		return springEnergy - this.position.y * 9.81;
	}

	constructor({position, isFixed}) {
		this.position = position;
		this.isFixed = isFixed;
	}

	connect(_otherNode) {
		let spring = new Spring(this, _otherNode);
		this.springs.push(spring);
		_otherNode.springs.push(spring);
	}
}