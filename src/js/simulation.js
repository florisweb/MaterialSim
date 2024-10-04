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
			let variant = this.generateWorldVariant();
			let energy = variant.energy;
			let deltaEnergy = energy - curEnergy;
			let accepted = deltaEnergy < 0 || Math.random() < Math.exp(-deltaEnergy * this.physics.Beta);
			if (accepted)
			{
				this.world = variant;
				return deltaEnergy;
			}
		}
		return false;
	}

	generateWorldVariant() {
		let newWorld = this.world.copy()
		let varyNodeIndex = Math.floor(newWorld.nodes.length * Math.random());
		const varyRange = .1;

		newWorld.nodes[varyNodeIndex].position.x += varyRange - 2 * varyRange * Math.random();
		newWorld.nodes[varyNodeIndex].position.y += varyRange - 2 * varyRange * Math.random();
		return newWorld;
	}
}