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

		this.renderer.setWorld(Simulation.world);
		this.render();
	}
	
	optimize() {
		Simulation.optimize(1000);
		this.render();
	}	

	render() {
		this.renderer.render();
		// Simulation.optimize(20);
		requestAnimationFrame(() => this.render());
	}
}

export default App;