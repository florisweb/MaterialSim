
export default class Vector {
	value = [];
	get x() {
		return this.value[0];
	}
	get y() {
		return this.value[1];
	}
	set x(_v) {
		this.value[0] = _v;
	}
	set y(_v) {
		this.value[1] = _v;
	}

	get length() {
		return Math.sqrt(this.dotProduct(this));
	}

	constructor(x, y) {
		this.value = [x, y];
	}

	add(_vector) {
		this.value[0] += _vector.value[0];
		this.value[1] += _vector.value[1];
		return this;
	}
	dotProduct(_vector) {
		return 	this.value[0] * _vector.value[0] + 
				this.value[1] * _vector.value[1];
	}

	crossProduct(_vector) {
		return this.value[0] * _vector.value[1] - this.value[1] * _vector.value[0];
	}

	
	difference(_vector) {
		return new Vector(
			_vector.value[0] - this.value[0],
			_vector.value[1] - this.value[1],
		);
	}

	getPerpendicular() {
		return new Vector(
			this.value[1],
			-this.value[0]
		);
	}

	scale(_scalar) {
		this.value[0] *= _scalar;
		this.value[1] *= _scalar;
		return this;
	}


	copy() {
		return new Vector(this.value[0], this.value[1]);
	}



	rotate(_angle) {
		this.setAngle(this.getAngle() + _angle, this.length);
		return this;
	}


	
	
	setLength(_length) {
		let length = this.length;
		if (length == 0) return this;
		
		this.scale(_length / length);
		return this;
	}


	getAngle() { // check
		return Math.atan2(this.value[1], this.value[0]);
	}
	
	setAngle(_angle, _radius = 1) {
		_angle = .5 * Math.PI - _angle;

		this.value[0] = Math.sin(_angle) * _radius;
		this.value[1] = Math.cos(_angle) * _radius;
		return this;
	}

	getProjection(_projectionVector) {
		let dAngle = _projectionVector.getAngle() - this.getAngle();
		let length = _projectionVector.length * Math.cos(dAngle);
		return new Vector(0, 0).setAngle(this.getAngle(), length);
	}	
}