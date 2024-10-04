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

		const nodeCount = 30;
		for (let i = 0; i < nodeCount; i++)
		{
			Simulation.world.nodes.push(new Node({position: new Vector(Math.random() * 100, Math.random() * 100)}))
		}
		Simulation.world.nodes[0].isFixed = true;
		Simulation.world.nodes[0].position.y = 10;
		Simulation.world.nodes[nodeCount - 1].isFixed = true;
		Simulation.world.nodes[nodeCount - 1].position.y = 10;

		for (let i = 0; i < nodeCount - 1; i++)
		{
			let self = Simulation.world.nodes[i];
			self.connect(Simulation.world.nodes[i + 1]);
		}

		for (let i = 0; i < 50; i++)
		{
			let randomNodeIndexA = Math.floor(Simulation.world.nodes.length * Math.random());
			let randomNodeIndexB = Math.floor(Simulation.world.nodes.length * Math.random());
			if (randomNodeIndexA === randomNodeIndexB) continue;
			let nodeA = Simulation.world.nodes[randomNodeIndexA];
			let nodeB = Simulation.world.nodes[randomNodeIndexB];
			let alreadyConnected = false;
			for (let spring of nodeA.springs)
			{
				if (spring.nodeA === nodeB || spring.nodeB === nodeB)
				{
					alreadyConnected = true;
					break;
				}
			}
			if (alreadyConnected) continue;
			nodeA.connect(nodeB);


		}
		
		this.render();

		let loop = () => {
			Simulation.optimize(100);
			this.render();
			requestAnimationFrame(loop);
		}
		loop()
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