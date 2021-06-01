import * as keys from '../keys.js';
import * as heroes from '../grupoHeroes.js';

var enfriamiento = 0;

export function preload() {
	this.load.spritesheet('Robin','assets/animaciones/robin/Stand.png', { frameWidth: 32, frameHeight: 32 });
	this.load.spritesheet('Basico','assets/animaciones/robin/espadazo.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('Arriba','assets/animaciones/robin/WalkUp.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('Abajo','assets/animaciones/robin/WalkDown.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('Derecha','assets/animaciones/robin/WalkRight.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('Izquierda','assets/animaciones/robin/WalkLeft.png', { frameWidth: 32, frameHeight: 32 });
	this.load.image('espadita','assets/images/cursor.png');
}

export function animacionRobin() {
	export var basico = this.physics.anims.create({
        key: 'basico',
        frames: this.anims.generateFrameNames('Basico', { frames: start: 0, end: 2 }),
        frameRate: 8,
  });
  this.anims.create({
  		key: 'quieto',
  		frames: this.anims.generateFrameNames('Robin', { start: 0, end: 2 }),
  		frameRate: 4,
  		repeat: -1
	});
	this.anims.create({
        key: 'WalkUp',
        frames: this.anims.generateFrameNames('Arriba', { start: 0, end: 1 }),
        frameRate: 4
  });
  this.anims.create({
        key: 'WalkDown',
        frames: this.anims.generateFrameNames('Abajo', { start: 0, end: 2 }),
        frameRate: 4
  });
  this.anims.create({
      key: 'WalkRight',
      frames: this.anims.generateFrameNames('Derecha', { start: 0, end: 1 }),
      frameRate: 4
  });
  this.anims.create({
      key: 'WalkLeft',
      frames: this.anims.generateFrameNames('Izquierda', { start: 0, end: 1 }),
      frameRate: 4
   });
}

export function create(spawn,muros,team,armas) {
	var armas_heroe = armas;

	animacionRobin();

	export var robin = team.create(spawn.x,spawn.y,'Robin');
	robin.name= "Robin";
	robin.hero = true;
	robin.inmune = false;
	robin.vida = 12;
	robin.vidaMax = 12;
	robin.velocidad = 200;
	robin.muerto = false;
	robin.contador = 0;
	robin.invisibilidad = 0;

  robin.play('quieto')

	this.physics.add.collider(robin, muros);

	var cursor = this.add.image(0,0,'espadita');
	cursor.pointer = keys.pointer;

  this.physics.add.overlap(e, basico, ataqueBasico, null, this);
}

export function updateRobin() {
	
	if (keys.Right.isDown) {
		robin.setVelocityX(-robin.velocidad);
		robin.play('WalkRight');
	}
	else if (keys.Left.isDown) {
		robin.setVelocityX(robin.velocidad);
		robin.play('WalkLeft');
	}
	else {
		robin.setVelocityX(0);
		robin.play('quieto')
	}
	if (keys.Down.isDown) {
		robin.setVelocityY(robin.velocidad);
		robin.play('WalkDown');
	}
	else if (keys.Up.isDown) {
		robin.setVelocityY(-robin.velocidad);
		robin.play('WalkUp');
	}
	else {
		robin.setVelocityY(0);
		robin.play('quieto')
	}

	if (keys.Hability.isDown && robin.contador == 0) {
		robin.contador++;
		robin.invisibilidad = 1;
		robin.inmune = true;
	}
	if (robin.contador <= 300 && robin.invisibilidad == 1) {
		robin.contador++;
		robin.alpha=0.4;
	}
	if (robin.contador >= 300) {
		robin.contador++;
		robin.invisibilidad = 0;
		robin.alpha = 1;
		robin.inmune = false;
	}
	if (robin.contador == 600) {
		robin.contador = 0;
	}

	if (keys.pointer.isDown && acabado) {
		basico.play('basico');
		basico.ataque = 4;
	}
}

export function ataqueBasico(e,b) {
  e.vida = e.vida - basico.ataque;
}