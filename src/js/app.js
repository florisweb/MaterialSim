import Renderer from './renderer.js';
import Simulation from './simulation.js';
import InputHandler from './inputHandler.js';
import Node from './node.js';
import Vector from './vector.js';
window.Vector = Vector;
window.Node = Node;

const App = new class {
	renderer = new Renderer(renderCanvas, this);
	inputHandler = new InputHandler(renderCanvas);
	constructor() {
		window.App = this;

		const nodeCount = 2;
		for (let i = 0; i < nodeCount; i++)
		{
			Simulation.world.nodes.push(new Node({position: new Vector(Math.random() * 100, Math.random() * 100)}))
		}
		Simulation.world.nodes[0].isFixed = true;
		Simulation.world.nodes[0].position.y = 10;
		Simulation.world.nodes[nodeCount - 1].isFixed = true;
		Simulation.world.nodes[nodeCount - 1].position.y = 10;

		this.renderer.setWorld(Simulation.world);
		this.render();
	}
	
	optimize() {
		Simulation.optimize(1000);
		this.render();
	}	

	render() {
		this.renderer.render();
		// Simulation.optimize(10);
		requestAnimationFrame(() => this.render());
	}
}

export default App;