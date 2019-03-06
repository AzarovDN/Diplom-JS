'use strict';


class Vector{
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	plus(vektor) {
		if (!Vector.prototype.isPrototypeOf(vektor)) {
      		throw Error('Можно прибавлять к вектору только вектор типа Vector');	
		}

		return new Vector(this.x + vektor.x, this.y + vektor.y);

	}

	times(time) {
		return new Vector(this.x * time, this.y * time);
	}

}


class Actor {
	constructor(pos = new Vector(), size = new Vector(1, 1), speed  = new Vector()) {
		if (!Vector.prototype.isPrototypeOf(pos) || 
			!Vector.prototype.isPrototypeOf(size) ||
			!Vector.prototype.isPrototypeOf(speed)) {
			throw Error('Вектору можно присваивать только вектор типа Vector')
		}  

		this.pos = pos;
		this.size = size;
		this.speed = speed;

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
		if (!Actor.prototype.isPrototypeOf(actor)){
			throw Error('Можно передавать параметр только типа Actor')
		}

		if (this === actor) { 
			return false 
		}

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

		if (((this.pos.x >= actor.pos.x) && (this.top <= actor.bottom)) ||
			((this.pos.y >= actor.pos.y) && (this.left <= actor.right)) ||
			((this.pos.x <= actor.pos.x) && (this.bottom <= actor.top)) ||
			((this.pos.y <= actor.pos.y) && (this.right <= actor.left))) {
			return true;
		
		}
	}
}


class Level {
	constructor(grid, actors) {
		this.grid = grid;
		this.actors = actors;
		
		if (this.actors instanceof Array) {
			for (let actor of this.actors) {
				if (actor.type === 'player') {
					this.player = actor;
					break;
				}
			}	
		}


		if (this.grid instanceof Array) {
			this.height = this.grid.length;
		} else {
			this.height = 0;
		}

		if ((this.grid instanceof Array)) {
			this.width = 0;
			for (let arr of this.grid) {
				if (arr instanceof Array) {
					if (this.width < arr.length) {
						this.width = arr.length;
					}	
				}
				
			}
		} else {
			this.width = 0;
		}

			

		this.status = null;
		this.finishDelay = 1;
	}

	isFinished() {
		if (this.status && (this.finishDelay < 0)) {
			return true;
		}
		return false;
	}
	

	actorAt(actor) {
		if (!Actor.prototype.isPrototypeOf(actor)) {
			throw Error('Можно передавать параметр только типа Actor')
		}	
		
		if (!this.actors) {
			return;
		}

		for (let moveActor of this.actors) {
			if (moveActor.isIntersect(actor)) {
				return moveActor;
			} 	
		}
		return;
	}

	obstacleAt(vector, size) {
		if (!(Vector.prototype.isPrototypeOf(vector)) ||
			!(Vector.prototype.isPrototypeOf(size))) {
			throw Error('Вектору можно присваивать только вектор типа Vector');
		}

		if (vector.x < 0 || vector.x + size.x > this.width ||
			vector.y < 0 ) {
			return 'wall';
		}

		if (vector.y + size.y >= this.height) {
			return 'lava';
		}

		for (let i = Math.floor(vector.y); i <= Math.ceil(size.y); i++) {
			for (let j = Math.floor(vector.x); i <= Math.ceil(size.x); i++) {
				if (this.grid[j][i] !== undefined) {
					return this.grid[j][i];
				}
			}
		}

		
			
	}

	removeActor(actor) {
		if (this.actors.includes(actor)) {
			let index = this.actors.findIndex((el) => el === actor)
			this.actors.splice(index, 1);
		}
	}

	noMoreActors(type) {
		if (!this.actors) { 
			return true 
		}

		
		return this.actors.every(
			function(actor) {
				return actor.type !== type;
			}
		);

		return true;
	}


	playerTouched(type, actor) {
		if (type === 'lava' || type === 'fireball') {
			this.status = 'lost'
		}

		if (type === 'coin') {
			this.removeActor(actor);
			if(this.noMoreActors(type)) {
				this.status = 'won'
			}
		}
	}

}	


class LevelParser{
	constructor(moveObjDict) {
		this.moveObjDict = moveObjDict;
	}

	actorFromSymbol(simbolString) {
		if(simbolString === undefined) { 
			return; 
		}

		if(simbolString in this.moveObjDict) {
      		return this.moveObjDict[simbolString]
    	}	
	}

	obstacleFromSymbol(simbolString) {
		if(simbolString === 'x') {
			return 'wall';
		}

		if(simbolString === '!') {
			return 'lava';
		}
	}

	createGrid(plan){
		if(plan.length === 0) { 
			return []; 
		}

		for(let i=0; i <plan.length;  i++) {
        	plan[i] = 	plan[i].split('');
			for (let j = 0; j < plan[i].length; j++) {
				plan[i][j] = this.obstacleFromSymbol(plan[i][j]);
			}
      	}
        return plan;
    }

	createActors(plan) {
		let result = []

		if(plan.length === 0) { 
			return [];
		}
		if (this.moveObjDict === undefined) { 
			return [];
		}

		for(let i=0; i <plan.length;  i++) {
			plan[i] = 	plan[i].split('');
			for (let j = 0; j < plan[i].length; j++) {
				try{          
					if(this.actorFromSymbol(plan[i][j]) !== undefined) {
						plan[i][j] = this.actorFromSymbol(plan[i][j]);
						let actor = new plan[i][j](new Vector(j,i))
						plan[i][j] = actor;
					}
				} catch(err) {
					continue;
				} 
			}
		}
		
		for (let string of plan) {
			for (let simbol of string){
          		if (!(typeof(simbol) === 'string') && Actor.prototype.isPrototypeOf(simbol)) {
              		result.push(simbol);
          		}
        	}  
    	} 
      
		return result;
	}

    parse(plan) {
    	let gridPlan = plan.slice();
    	let actorPlan = plan.slice();

    	let level = new Level(this.createGrid(gridPlan), this.createActors(actorPlan));
    	return level;
    }
      
}


class Fireball  extends Actor {
	constructor(pos = new Vector (0,0), speed = new Vector (0,0)) {
		super(pos, new Vector (1, 1), speed)
	}

	get type() {
		return 'fireball'
	}

	getNextPosition(time = 1) {
		if(this.speed.x === 0 && this.speed.y === 0) { 
			return this.pos;
		}
		return this.pos.plus(this.speed.times(time))
	}

	handleObstacle() {
			this.speed.x *= -1;
			this.speed.y *= -1;
	}

	act(time, level) {

		if(level.obstacleAt(this.getNextPosition(time), this.size) === undefined) {
			this.pos = this.getNextPosition(time);
		} else { 
			this.handleObstacle (); 
		}

	}

}


class HorizontalFireball extends Fireball {
	constructor(pos){
		super(pos, new Vector (2, 0));
	}
}


class VerticalFireball extends Fireball {
	constructor(pos){
		super(pos, new Vector (0, 2));
	}
}


class FireRain extends Fireball {
	constructor(pos){
		super(pos, new Vector (0, 3));
		this.startPos = pos
	}

	handleObstacle() {
		this.pos = this.startPos
	}
}


class Coin extends Actor {
	constructor(pos = (new Vector())) {
		super(pos.plus(new Vector(0.2, 0.1)), new Vector (0.6, 0.6));
		this.base =this.pos;
		this.springSpeed = 8;
		this.springDist = 0.07;
		this.spring = Math.random() * 2 * Math.PI;
	}

	get type() {
		return 'coin';
	}

	updateSpring(time = 1) {
		this.spring += this.springSpeed * time;
	}

	getSpringVector() {
		return new Vector (0, Math.sin(this.spring) * this.springDist);
	}

	getNextPosition(time = 1) {
		this.updateSpring(time)
		let springVector = this.getSpringVector()
		return this.base.plus(this.getSpringVector())

	}

	act(time) {
		this.pos = this.getNextPosition(time);
	}
}


class Player extends Actor { 
	constructor (pos = new Vector()){
		super(pos.plus(new Vector(0, -0.5)), new Vector (0.8, 1.5));
	}

	get type() {
		return 'player';
	}
}

const schemas = [
  [
    ' o     ',
    '      	',
    '     	',
    '    	',
    '      	',
    '    @	',
    '       ',
    '!!!!!!!'
  ],

  [
    '       |    	',
    'o           	',
    '    =       	',
    '       o    	',
    '       xxxxx  	',
    ' @    x   		',
    'xxxxxx         ',
    '!!!!!!!!!!!!!!!'
  ],
  [
    '      v  ',
    '    v    ',
    '  v      ',
    '        o',
    '        x',
    '@   x    ',
    'x        ',
    '         '
  ]
];
const actorDict = {
  '@': Player,
  'v': FireRain,
  'o': Coin,
  '=': HorizontalFireball,
  '|': VerticalFireball
}
const parser = new LevelParser(actorDict);
runGame(schemas, parser, DOMDisplay)
  .then(() => aler('Вы выиграли приз!'));
