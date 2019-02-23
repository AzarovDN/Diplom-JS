'use strict';


class Vector{
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	plus(vektor) {
		if (Vector.prototype.isPrototypeOf(vektor)) {
			let x = this.x;
			let y = this.y;
      		return new Vector(x += vektor.x, y += vektor.y);
		} else {
			throw Error('Можно прибавлять к вектору только вектор типа Vector');
		}

	}

	times(time) {
		return new Vector(this.x *= time, this.y *= time);
	}

}

