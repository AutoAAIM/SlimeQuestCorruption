import * as keys from '../keys.js';
import * as heroes from '../grupoHeroes.js';

var enfriamiento = 0;

export function preload() {
	this.load.spritesheet('Robin','assets/animaciones/robin/Stand.png', { frameWidth: 32, frameHeight: 32 });
	this.load.spritesheet('Robin','assets/animaciones/robin/espadazo.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('Arriba','assets/animaciones/robin/WalkUp.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('Abajo','assets/animaciones/robin/WalkDown.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('Derecha','assets/animaciones/robin/WalkRight.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('Izquierda','assets/animaciones/robin/WalkLeft.png', { frameWidth: 32, frameHeight: 32 });
	this.load.image('espadita','assets/images/cursor.png');
}

export function animacionRobin() {
	this.physics.anims.create({
        key: 'basico',
        frames: this.anims.generateFrameNames('espadazo', { frames: start: 1, end: 3 }),
        frameRate: 8,
    });
    this.anims.create({
  		key: 'quieto',
  		frames: this.anims.generateFrameNames('Robin', { start: 0, end: 2 }),
  		frameRate: 4,
  		repeat: -1
	});
	this.anims.create({
        key: '',
        frames: this.anims.generateFrameNames('Robin', { start: 3, end: 5 }),
        frameRate: 4,
        repeat: -1
  });
  this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('Robin', { start: 3, end: 5 }),
        frameRate: 4,
        repeat: -1
  });
  this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNames('Robin', { start: 3, end: 5 }),
      frameRate: 4,
      repeat: -1
  });
  this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNames('Robin', { start: 3, end: 5 }),
      frameRate: 4,
      repeat: -1
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

	this.physics.add.collider(robin, muros);

	var cursor = this.add.image(0,0,'espadita');
	cursor.pointer = keys.pointer;

	//this.cameras.main.startFollow(robin);

}

export function updateRobin() {
	
	if (keys.Right.isDown) {
		robin.setVelocityX(-robin.velocidad);
		robin.play('walk');
	}
	else if (keys.Left.isDown) {
		robin.setVelocityX(robin.velocidad);
		robin.play('walk');
	}
	else {
		robin.setVelocityX(0);
		robin.play('idle');
	}
	if (keys.Down.isDown) {
		robin.setVelocityY(robin.velocidad);
		robin.play('walk');
	}
	else if (keys.Up.isDown) {
		robin.setVelocityY(-robin.velocidad);
		robin.play('walk');
	}
	else {
		robin.setVelocityY(0);
		robin.play('idle');
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
		robin.basico.play('basico');
		robin.basico.ataque = 4;
	}
}