import * as robin from '../personajes/robin.js'
import * as heroes from './grupoHeroes.js';

export function preload() {
	this.load.image('Boss_volcan','assets/sprites/Boss.png');
	this.load.image('fireball','assets/sprites/fireball.png');
}

export function animacionBossDesierto() {

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
				createFuegoCono(3,boss);
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
				createPrision(boss);
				boss.tiempo = 0;
			}
			else {
				boss.tiempo++;
			}
		break;
		default: // 5 bolas de fuego en forma de cono
			if (boss.tiempo > 50) {
				createFuegoCono(5,boss);
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

	updateFire();

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

export function createFuegoCono(c,boss) {
	
	var f = fireList.create(boss.x,boss.y,'Fuego');
	f.tiempo = 0; // El tiempo para que desaparezca
	f.ataque = 1; 
	f.persigue = false;
}

export function createPrision(boss) {
	
	var f = fireList.create(boss.x,boss.y,'Fuego');
	f.tiempo = 0; // El tiempo para que desaparezca
	f.ataque = 1; 
	f.persigue = false;
}

export function updateFire(f) {
	if (f.persigue) {
		this.physics.moveTo(f,heroes.cabeza.x,heroes.cabeza.y,velocidad_fuego);
	}
	if (f.tiempo > 50) {
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