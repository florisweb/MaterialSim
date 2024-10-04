import Vector from './vector.js';
import Spring from './spring.js';

export default class Node {
	springs = [];
	position = new Vector(0, 0);
	isFixed = false;
	get energy() {
		return this.springs.filter(spring => spring.nodeA === this).map(spring => spring.energy).reduce((a, b) => a + b, 0);
	}

	constructor({position}) {
		this.position = position;
	}

	connect(_otherNode) {
		let spring = new Spring(this, _otherNode);
		this.springs.push(spring);
		_otherNode.springs.push(spring);
	}
}