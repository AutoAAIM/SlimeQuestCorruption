import * as robin from '../personajes/robin.js';
import * as heroes from './grupoHeroes.js';

export function preload() {
	this.load.spritesheet('Boss_volcan','assets/sprites/Boss.png');
	this.load.spritesheet('fireball','assets/sprites/fireball.png');
}

export function animacionBossDesierto() {
  this.physics.anims.create({
      key: 'Walk',
      frames: this.anims.generateFrameNames('Basico', { frames: start: 1, end: 4 }),
      frameRate: 8,
      repeat: -1
  });
}

export function animacionFuego() {
  this.physics.anims.create({
    key: 'Fuego',
    frames: this.anims.generateFrameNames('fireball', { frames: start: 1, end: 2 }),
    frameRate: 8,
    repeat: -1
  });
}

var velocidad_fuego = 100;

export function create(obj) {
	
	animacionBossDesierto();

	var boss = this.physics.add.sprite(obj.x,obj.y,'Boss_volcan');
	boss.vida = 50;
	boss.fase = 1;
	boss.velocidad = 150;
	boss.frecuencia = 50; // Tiempo entre ataques
	boss.contador = 0;  // Contador de tiempo en el que esta quieto
	boss.posicion = 240; // Espacio lateral de 48 a 528 --> (480)
	boss.direccion = 1; // 0 - Izquierda, 1 - Derecha, 2 - Quieto 
	boss.tiempo = 0; // contador del tiempo entre los ataques
	boss.aux = 0;
}

export function update(boss) {

	const posicion = 150;
	const tipo;

	if (boss.fase == 1) {
		tipo = 1;
	}
	else {
		tipo = -1;
	}

	if (boss.posicion > 480) {
		boss.direccion = 0;
	}
	else if (boss.posicion < 0) {
		boss.direccion = 1;
	}

	if (boss.contador >= 20) {
		boss.contador = 0;
		boss.direccion = Phaser.Math.Between(0,1);
	}

	// Movimiento boss

	if (boss.direccion == 0) {
		boss.setVelocityX(boss.velocidad);
	}
	else if (boss.direccion == 1) {
		boss.setVelocityX(-boss.velocidad);
	}
	else if (boss.direccion == 2) {
		boss.setVelocityX(0);
	}

	if (boss.direccion == 2) {
		boss.contador++;
	}

	// Que tipo de ataque utilizara

	if (boss.fase == 1) {
		boss.accion = Phaser.Math.Between(1,4); 
	}
	else if (s.fase == 2) {
		boss.accion = Phaser.Math.Between(2,5); 
	}

	switch(boss.accion) {
		case 1: // Tres bolas de fuego en forma de cono
			if (boss.tiempo > 50) {
				createConoFuego(boss,0,-1); 		
				createConoFuego(boss,0.5,0.87);		// ( 1/2, -(raiz de 3)/2 )
				createConoFuego(boss,-0.5,0.87);	// ( -1/2, -(raiz de 3)/2 ) 
			
				boss.tiempo = 0;
			}
			else {
				boss.tiempo++;
			}
		
		break;
		case 2: // Una bola de fuego
			if (boss.tiempo > 50) {
				createBolaFuego(boss);
				boss.tiempo = 0;
			}
			else {
				boss.tiempo++;
			}
		break;
		case 3: // Ataque de pinzas
			if (boss.tiempo > 50) {
				createFire(boss);
				boss.tiempo = 0;
			}
			else {
				boss.tiempo++;
			}
		break;
		case 4: // Cuatro bolas de fuego
			if (boss.tiempo > 50) {
				createPrision(posicion, 0,tipo, 1 , 0);
				createPrision(-posicion, ,tipo, -1, 0);
				createPrision(0, posicion,tipo, 0, 1);
				createPrision(0, -posicion,tipo, 0, -1);

				boss.tiempo = 0;
			}
			else {
				boss.tiempo++;
			}
		break;
		default: // 5 bolas de fuego en forma de cono
			if (boss.tiempo > 50) {
				createConoFuego(boss,0,-1); 		
				createConoFuego(boss,0.5,0.87);		// ( 1/2, -(raiz de 3)/2 )
				createConoFuego(boss,-0.5,0.87);	// ( -1/2, -(raiz de 3)/2 ) 
				createConoFuego(boss,1,-1);			
				createConoFuego(boss,-1,-1);
			
				boss.tiempo = 0;
			}
			else {
				boss.tiempo++;
			}
		break;
	}

	if (boss.vida < 20 && !boss.aux) { // El aux para que no lo lea cada vez que pasa
		
		boss.fase = 2;
		boss.aux = 1;
		boss.velocidad = 200;
		boss.frecuencia = 30;
	}
	else if (boss.vida <= 0) {
		destroyBoss(boss);
	}
	
	for (i = 0; i < shootList.getChildren().length; i++) {
		var fuego = shootList.getChildren()[i];
		updateFire(fuego);
	}
}

export function createFireBossGroup() {
	var fireBossList = this.add.group();
}

export function createBolaFuego (boss) {
	
	var f = fireList.create(boss.x,boss.y,'Fuego');
	f.tiempo = 0; // El tiempo para que desaparezca
	f.ataque = 1; 

	if (boss.fase == 1) {
		f.persigue = false;
	}
	if (boss.fase == 2) {
		f.persigue = true;
	}

	this.physics.moveTo(f,heroes.cabeza.x,heroes.cabeza.y,velocidad_fuego); 
}

export function createConoFuego(boss,x,y) {
	
	var f = fireList.create(boss.x,boss.y,'Fuego');
	f.tiempo = 0; // El tiempo para que desaparezca
	f.ataque = 1; 
	f.persigue = false;
	f.setVelocity(x * velocidad_fuego, y * velocidad_fuego);

}

export function createPrision(x,y,tipo,dir1,dir2) {
	
	var pos = 0;

	pos.x = heroes.heroes.x + x; 
	pos.y = heroes.heroes.y + y; 

	var f = fireList.create(pos.x,pos.y,'Fuego');
	f.tiempo = 0; // El tiempo para que desaparezca
	f.ataque = 1; 
	f.persigue = false;

	f.setVelocityX(velocidad_fuego * tipo * dir1);
	f.setVelocityY(velocidad_fuego * tipo * dir2);
}

export function updateFire(f) {
	if (f.persigue) {
		this.physics.moveTo(f,heroes.cabeza.x,heroes.cabeza.y,velocidad_fuego);
	}
	if (f.tiempo > 250) {
		destroyFire(f);
	}
	else {
		f.tiempo++;
	}
}

export function createFire(x,y,c) {
	const angulo = 0;
	var fire;

	if (c == 1) {
		fire = fireList.create(x,y,'fireball');
		fire.setVelocity(0,100);
	}
	else if (c == 3) {
		for (i = 0; i < c; i++) { 
			if (i == 1) {
				fire = fireList.create(x,y,'fireball');
				fire.setVelocity(75,100);
			}
			else if (i == 2) {
				fire = fireList.create(x,y,'fireball');
				fire.setVelocity(0,100);
			}
			else if (i == 3) {
				fire = fireList.create(x,y,'fireball');
				fire.setVelocity(-75,100);
			}	
		}
	}
	else if (c == 4) {
		for (i = 0; i < c; i++) {
			if (i == 0) {
				fire = fireList.create(x,y + 70,'fireball');
				fire.setVelocity(0,100);
			}
			if (i == 1) {
				fire = fireList.create(x + 70,y,'fireball');
				fire.setVelocity(100,0);
			}
			else if (i == 2) {
				fire = fireList.create(x - 70,y,'fireball');
				fire.setVelocity(-100,0);
			}
			else if (i == 3) {
				fire = fireList.create(x,y - 70,'fireball');
				fire.setVelocity(0,-100);
			}
		}
	}
	else if (c == 6) {
		angulo = 0;
		for (i = 0; i < c; i++) { 
			if (i < 3) {
				fire = fireList.create(x,y,'fireball');
				fire.setVelocity(0.5 * angulo,100);
				angulo = angulo - 36;
			}
			else if (i > 2) {
				fire = fireList.create(x,y,'fireball');
				fire.setVelocity(-0.5 * angulo,100);
				angulo = angulo + 36;
			}	
		}
	}
}

export function destroyBoss(boss) {
	boss.destroy();
	boss.body.enable = false;
}

export function destroyFire(fire) {
	fire.destroy();
	fire.body.enable = false;
	fireBossList.remove(fire)
}