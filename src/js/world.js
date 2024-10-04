import Vector from './vector.js';
import Node from './node.js';

export default class World {
	size = new Vector(200, 200);
	nodes = [];

	get energy() {
		return this.nodes.map(node => node.energy).reduce((a, b) => a + b, 0);
	}

	constructor({nodes = []} = {nodes: []}) {
		this.nodes = nodes;
	}

	copy() {
		let newNodes = this.nodes.map(_oldNode => new Node({position: _oldNode.position.copy()}));
		for (let node of this.nodes)
		{
			let ownNodeIndex = this.nodes.findIndex(_node => node.position.difference(_node.position).length === 0);
			let ownNode = newNodes[ownNodeIndex];

			for (let spring of node.springs)
			{
				if (spring.nodeA !== node) continue;
				let otherNodeIndex = this.nodes.findIndex(_node => spring.nodeB.position.difference(_node.position).length === 0);
				if (!otherNodeIndex) console.warn('problem', otherNodeIndex);

				ownNode.connect(newNodes[otherNodeIndex]);
			}
		}
		return new World({nodes: newNodes});
	}
}