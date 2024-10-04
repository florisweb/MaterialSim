import Vector from './vector.js';
import World from './world.js';

export default new class Simulation {
	physics = {
		Beta: 0,
		Kb: 1.380 * Math.pow(10, -23), // J/K
		T: 293, // K
	}
	world = new World();
	
	constructor() {
		window.Simulation = this;
		this.physics.Beta = 1 / (this.physics.Kb * this.physics.T);
	}

	optimize(_steps = 10000) {
		for (let i = 0; i < _steps; i++) this.step()
	}

	step() {
		let curEnergy = this.world.energy;

		for (let i = 0; i < 100; i++)
		{
			let varyNodeIndex = Math.floor(this.world.nodes.length * Math.random());
			let node = this.world.nodes[varyNodeIndex];
			while (node.isFixed)
			{
				varyNodeIndex = Math.floor( this.world.nodes.length * Math.random());
				node = this.world.nodes[varyNodeIndex];
			}

			const varyRange = .1 + Math.random();
			let vary = new Vector(varyRange - 2 * varyRange * Math.random(), varyRange - 2 * varyRange * Math.random());
			node.position.add(vary);

			let energy = this.world.energy;
			let deltaEnergy = energy - curEnergy;
			let accepted = deltaEnergy < 0 || Math.random() < Math.exp(-deltaEnergy * this.physics.Beta);
			
			if (accepted) return deltaEnergy;
			node.position.add(vary.scale(-1));
		}
		return false;
	}
}