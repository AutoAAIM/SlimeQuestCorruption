import * as robin from '../personajes/robin.js'
import * as heroes from './grupoHeroes.js';

export var inmune = false;

export function preload() {
	this.load.spritesheet('Escorpion','assets/animaciones/escorpion/Stand.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('Arriba','assets/animaciones/escorpion/WalkUp.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('Abajo','assets/animaciones/escorpion/WalkDown.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('Derecha','assets/animaciones/escorpion/WalkRight.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('Izquierda','assets/animaciones/escorpion/WalkLeft.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('Attack','assets/animaciones/escorpion/ataque.png', { frameWidth: 32, frameHeight: 32 });

}

export function animacionEscorpion() {
  this.physics.anims.create({
      key: 'Stand',
      frames: this.anims.generateFrameNames('Escorpion', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
  });
  this.physics.anims.create({
      key: 'WalkUp',
      frames: this.anims.generateFrameNames('Arriba', { start: 0, end: 3 }),
      frameRate: 8
  });
  this.physics.anims.create({
      key: 'WalkDown',
      frames: this.anims.generateFrameNames('Abajo', { start: 0, end: 3 }),
      frameRate: 8
  });
  this.physics.anims.create({
      key: 'WalkLeft',
      frames: this.anims.generateFrameNames('Izquierda', { start: 0, end: 1 }),
      frameRate: 8
  });
  this.physics.anims.create({
      key: 'WalkRight',
      frames: this.anims.generateFrameNames('Derecha', { start: 0, end: 1 }),
      frameRate: 8
  });
  this.physics.anims.create({
      key: 'golpe',
      frames: this.anims.generateFrameNames('Attack', { start: 0, end: 3 }),
      frameRate: 8
  });
}

export function createGroup(muros) {
	var escorpionList = this.add.group();
	this.physics.add.collider(escorpionList,escorpionList);
	this.physics.add.collider(escorpionList,muros);
}

export function createEscorpion(e) {

	animacionEscorpion();

	var e = escorpionList.create(e.x,e.y,'Escorpion');
	
	e.vida = 5;
	e.buscar = false;
	e.ataque = 1;
	e.velocidad = 150;

  e.play('Stand')

	e.detect = this.add.circle(e.x,e.y,30);
	this.physics.add.existing(e.detect,false);
	e.detect.encontrado = false;

  this.physics.add.overlap(e.detect, heroes.heroes, detectar, null, this);
	this.physics.add.overlap(escorpionList, heroes.heroes, detectar, null, this);
}

export function detectar(e,h) {
	e.detect.encontrado = true;
  e.stop('Stand');
}

export function update(e) {

	if (e.detect.encontrado) {
		e.perseguir = true;	
	}
	else {
		e.perseguir = false;
	}
	if (e.perseguir) {
		this.physics.moveTo(e,heroes.cabeza.x,heroes.cabeza.y,e.velocidad);
	}
}

export function updateVidaEscorpion(e) {
	if (!e.inmune && e.vida > 0) {
		e.vida--;

		scene.tweens.addCounter({
			from: 100,
			to: 0,
			duration: 1000,
			onUpdate: function (tween) {
				var value = Math.floor(tween.getValue());

				e.inmune = true;

				e.setAlpha(value % 2)

				if (value == 0) {
					e.setAlpha(1)
					e.inmune = false;
				}
			}
		});
	}
	else if (e.vida <= 0) {
		destroyEscorpion(e);
    
	}
	
}

export function destroyEscorpion(e) {
	e.detect.destroy();
	e.body.enable = false;
	escorpionList.remove(e);
}