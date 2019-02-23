'use strict';


class Vector{
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	plus(vektor) {
		if (Vector.prototype.isPrototypeOf(vektor)) {
      		return new Vector(this.x + vektor.x, this.y + vektor.y);
		} else {
			throw Error('Можно прибавлять к вектору только вектор типа Vector');
		}

	}

	times(time) {
		return new Vector(this.x *= time, this.y *= time);
	}

}


class Actor {
	constructor(pos = new Vector(), size = new Vector(1, 1), speed  = new Vector()) {
		if (Vector.prototype.isPrototypeOf(pos)) {
			this.pos = pos;
		} else {
			throw Error()
		}

		if (Vector.prototype.isPrototypeOf(size)) {
			this.size = size;
		} else {
			throw Error()
		}

		if (Vector.prototype.isPrototypeOf(speed)) {
			this.speed = speed;
		} else {
			throw Error()
		}
	}

	get left () {
		return this.pos.x
	}

	get right () {
		return this.pos.x + this.size.x
	}


	get top () {
		return this.pos.y
	}

	get bottom () {
		return this.pos.y + this.size.y
	}

	act() {}

	get type() {
		return 'actor';
	} 

	isIntersect(actor) {
		if (Actor.prototype.isPrototypeOf(actor)){
			if (this === actor) { return false }

			if (((this.left < actor.left) && (this.right < actor.left)) &&
				((this.top < actor.top) && (this.bottom < actor.bottom))) {
				return false;
			}

			if (((this.left > actor.left) && (this.left > actor.right)) &&
				((this.top < actor.top) && (this.bottom < actor.bottom))) {
				return false;
			}

			if (((this.left < actor.left) && (this.right < actor.left)) &&
				((this.top > actor.top) && (this.top > actor.bottom))) {
				return false;
			}

			if (((this.left > actor.left) && (this.left > actor.right)) &&
				((this.top > actor.top) && (this.top > actor.bottom))) {
				return false;
			}

			if ((this.top === actor.bottom) || (this.bottom === actor.top) || 
				(this.left === actor.right) || (this.right === actor.left)) {
				return false;
			} 

			if (((this.pos.x === actor.pos.x) && (this.pos.y === actor.pos.y)) && 
				(actor.size.x < 0 && actor.size.y < 0)) {
				return false;
			}
		

			if ((this.top <= actor.top) && (this.bottom >= actor.bottom) && 
				(this.left <= actor.left) && (this.right >= actor.right)) {
				return true;
			} 

			if (((this.pos.x > actor.pos.x) && (this.top < actor.bottom)) ||
				((this.pos.y > actor.pos.y) && (this.left < actor.right)) ||
				((this.pos.x < actor.pos.x) && (this.bottom < actor.top)) ||
				((this.pos.y < actor.pos.y) && (this.right < actor.left))) {
				return true;
			}

		} else {
			throw Error()
		}


	}


}	
