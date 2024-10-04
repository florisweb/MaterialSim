import Renderer from './renderer.js';
import Simulation from './simulation.js';
import Node from './node.js';
import Vector from './vector.js';
window.Vector = Vector;
window.Node = Node;

const App = new class {
	renderer = new Renderer(renderCanvas);
	constructor() {
		window.App = this;

		
		for (let i = 0; i < 20; i++)
		{
			Simulation.world.nodes.push(new Node({position: new Vector(Math.random() * 100, Math.random() * 100)}))
		}


		for (let i = 0; i < 20 - 1; i++)
		{
			let self = Simulation.world.nodes[i];
			self.connect(Simulation.world.nodes[i + 1]);
			// for (let x = 0; x < 3; x++)
			// {
			// 	let randomOtherIndex = Math.floor(Simulation.world.nodes.length * Math.random());
			// 	if (randomOtherIndex === i) continue;
			// 	let randomOther = Simulation.world.nodes[randomOtherIndex];
			// 	self.connect(randomOther);
			// }
		}
		
		this.render();


		// setInterval(() => {
		// 	Simulation.optimize(50);
		// 	this.render();
		// }, 10);
	}
	
	optimize() {
		Simulation.optimize(1000);
		this.render();
	}	

	render() {
		this.renderer.renderWorld(Simulation.world);
	}
}

export default App;