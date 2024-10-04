import Vector from './vector.js';
let App;
export default class Renderer {
	Canvas;
	ctx;

	size = new Vector(100, 100);
	#curWorld;

	constructor(_canvas, _app) {
		this.Canvas = _canvas;
		this.ctx = this.Canvas.getContext('2d');
		this.camera = new Camera(this);
		App = _app;
	}


	render() {
		this.ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
		if (this.#curWorld) this.#renderWorld(this.#curWorld);

		if (App.inputHandler.drawingLine)
		{
			this.#drawLine(App.inputHandler.curStingStartNode.position, App.inputHandler.curMousePos, '#f00');
		};
	}


	setWorld(_world) {
		this.#curWorld = _world;
	}

	#renderWorld(_world) {
		for (let node of _world.nodes) {
			this.#drawNode(node);
			let springs = node.springs.filter(_spring => _spring.nodeA === node);
			for (let spring of springs) this.#drawSpring(spring);
		}
	}
	
	
	#drawNode(_node) {
		// if (!_node.isFixed) return;
		const nodePxRadius = .5 * this.camera.getPxToWorldScalar(); // _node.mass / Math.PI * .25 * This.camera.getPxToWorldScalar();
		let pos = this.camera.worldToPxCoord(_node.position);
		this.ctx.fillStyle = '#555';
		if (_node.isFixed) this.ctx.fillStyle = '#f00';
		this.ctx.beginPath();
		this.ctx.fillRect(pos.value[0] - nodePxRadius, pos.value[1] - nodePxRadius, nodePxRadius * 2, nodePxRadius * 2);
		this.ctx.closePath();
		this.ctx.fill();
	}

	#drawSpring(_spring) {
		this.#drawLine(_spring.nodeA.position, _spring.nodeB.position, '#777');
	}

	#drawLine(_posA, _posB, _color) {
		let posA = this.camera.worldToPxCoord(_posA);
		let posB = this.camera.worldToPxCoord(_posB);
	
		this.ctx.strokeStyle = _color;
		this.ctx.beginPath()
		this.ctx.moveTo(posA.value[0], posA.value[1]);
		this.ctx.lineTo(posB.value[0], posB.value[1]);
		this.ctx.closePath();
		this.ctx.stroke();
	}
}	


class Camera {
	#PxToWorld;
	#WorldToPx;
	constructor(_renderer) {
		window.onresize = () => {
			_renderer.Canvas.width = _renderer.Canvas.offsetWidth;
			_renderer.Canvas.height = _renderer.Canvas.offsetHeight;

			this.#PxToWorld = _renderer.Canvas.width / _renderer.size.x;
			this.#WorldToPx = 1 / this.#PxToWorld;
			_renderer.size.y = this.#WorldToPx * _renderer.Canvas.height;
		}
		window.onresize();

	} 

	getPxToWorldScalar() {
		return this.#PxToWorld;
	}


	worldToPxCoord(_coord) {
		return _coord.copy().scale(this.#PxToWorld);
	}
	pxToWorldCoord(_coord) {
		return _coord.copy().scale(this.#WorldToPx);
	}
}
