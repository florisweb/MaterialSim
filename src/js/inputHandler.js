import Simulation from './simulation.js';
import App from './app.js';
import Vector from './vector.js';

let Canvas;
const maxNodeDragDistanceSquared = 5**2;

export default class InputHandler {
	curStingStartNode;
	get drawingLine() {
		return !!this.curStingStartNode;
	}


	curMousePos = new Vector(0, 0);

	constructor(_canvas) {
		Canvas = _canvas;

		Canvas.addEventListener('mousedown', (_e) => {
			let pxPos = this.#eventToPxCoord(_e);
			let curMousePos = App.renderer.camera.pxToWorldCoord(pxPos);
			let curSet = this.#getNodeSetByPos(curMousePos);
			if (!this.curStingStartNode && curSet)
			{
				this.curStingStartNode = curSet.node;
			}
		});

		window.addEventListener('mouseup', (_e) => {
			let pxPos = this.#eventToPxCoord(_e);
			let curMousePos = App.renderer.camera.pxToWorldCoord(pxPos);
			let curSet = this.#getNodeSetByPos(curMousePos);

			if (this.curStingStartNode)
			{
				if (_e.shiftKey)
				{

					let newNode = new Node({position: this.curMousePos.copy()});
					Simulation.world.nodes.push(newNode);
					let spring = this.curStingStartNode.connect(newNode);
					spring.targetLength = this.curMousePos.difference(this.curStingStartNode.position).length
				} else if (curSet)
				{
					if (this.curStingStartNode.id === curSet.node.id) return;
					
					let exists = this.curStingStartNode.springs.find(spring => 
						(spring.nodeA.id === this.curStingStartNode.id || spring.nodeB.id === this.curStingStartNode.id) &&
						(spring.nodeA.id === curSet.node.id || spring.nodeB.id === curSet.node.id)
					);
					if (exists) 
					{
						exists.remove();
						Simulation.world.nodes = Simulation.world.nodes.filter(node => node.springs.length > 0 || node.isFixed);

					} else {
						let spring = this.curStingStartNode.connect(curSet.node);
						spring.targetLength = this.curStingStartNode.position.difference(curSet.node.position).length
					}
				}
			} else if (_e.shiftKey) {
				let newNode = new Node({position: this.curMousePos.copy(), isFixed: true});
				Simulation.world.nodes.push(newNode);
			}
			this.curStingStartNode = null;

		});

		Canvas.addEventListener('mousemove', (_e) => {
			let pxPos = this.#eventToPxCoord(_e);
			this.curMousePos = App.renderer.camera.pxToWorldCoord(pxPos);
		});
	}



	#eventToPxCoord(_e) {
		return new Vector(
			_e.offsetX / Canvas.offsetWidth * Canvas.width,
			_e.offsetY / Canvas.offsetHeight * Canvas.height
		);
	}


	#getNodeSetByPos(_pos) {
		let results = this.#getSortedNodeSets(_pos);
		if (!results[0]) return false;
		return results[0];
	}

	#getSortedNodeSets(_pos, _maxRangeSquared = maxNodeDragDistanceSquared) {
		let nodeSets = []
		for (let node of Simulation.world.nodes)
		{
			// if (node.isFixed) continue;
			let delta = _pos.difference(node.position);
			let distanceSquared = delta.dotProduct(delta);
			if (distanceSquared > _maxRangeSquared) continue;
			nodeSets.push({
				distanceSquared: distanceSquared,
				delta: delta,
				node: node
			});
		}
		return nodeSets.sort((a, b) => a.distanceSquared > b.distanceSquared);
	}

}


// function _InputHandler(_canvas) {
// 	const This = this;
// 	this.dragProtectionEnabled = false;
// 	let dragging = false;
// 	let targetNode = false;
// 	let curHoverString = false;
// 	const maxNodeDragDistanceSquared = Math.pow(2, 2);
// 	const maxNodeCutDistanceSquared = Math.pow(.5, 2);
// 	const springConstant = 1000;

// 	let mousedown = false;



// 	this.update = function() {
// 		if (UI.curTool == 'cut' && mousedown && curHoverString)
// 		{
// 			curHoverString.cut();
// 			curHoverString = false;
// 		}

// 		if (UI.curTool != 'drag' || !dragging) return;
// 		let delta = targetNode.position.difference(curMousePos);
// 		let dragForce = delta.setLength(.5 * springConstant * delta.dotProduct(delta));
// 		targetNode.nettoForce.add(dragForce);		
// 	}



// 	function getNodeSetByPos(_pos) {
// 		let results = getSortedNodeSets(_pos);
// 		if (!results[0]) return false;
// 		return results[0];
// 	}


// 	function getSpringSetByPos(_pos) {
// 		let nodeSets = getSortedNodeSets(_pos, maxNodeCutDistanceSquared);

// 		let springSets = [];

// 		for (let nodeSet of nodeSets)
// 		{
// 			for (let spring of nodeSet.node.springs)
// 			{
// 				let otherNode = spring.getOtherNode(nodeSet.node);
// 				let delta = _pos.difference(otherNode.position);
// 				let distanceSquared = delta.dotProduct(delta);
// 				springSets.push({
// 					spring: spring,
// 					score: nodeSet.distanceSquared + distanceSquared,
// 				});
// 			}
// 		}

// 		let results = springSets.sort((a, b) => a.score > b.score);
// 		if (!results[0]) return false;
// 		return results[0];
// 	}


// 	function getSortedNodeSets(_pos, _maxRangeSquared = maxNodeDragDistanceSquared) {
// 		let nodeSets = []
// 		for (let node of Simulation.nodes)
// 		{
// 			if (node.isFixed) continue;
// 			let delta = _pos.difference(node.position);
// 			let distanceSquared = delta.dotProduct(delta);
// 			if (distanceSquared > _maxRangeSquared) continue;
// 			nodeSets.push({
// 				distanceSquared: distanceSquared,
// 				delta: delta,
// 				node: node
// 			});
// 		}
// 		return nodeSets.sort((a, b) => a.distanceSquared > b.distanceSquared);
// 	}


// 	function eventToPxCoord(_e) {
// 		return new Vector(
// 			_e.offsetX / _canvas.offsetWidth * _canvas.width,
// 			_e.offsetY / _canvas.offsetHeight * _canvas.height
// 		)
// 	}
// }