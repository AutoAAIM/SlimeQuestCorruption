import * as robin from '../personajes/robin.js';
import * as heroes from './grupoHeroes.js';

export function preload() {
	this.load.spritesheet('Boss_volcan','assets/sprites/Boss.png', { frameWidth: 32, frameHeight: 32 });
	this.load.spritesheet('fireball','assets/sprites/fireball.png', { frameWidth: 32, frameHeight: 32 });
  this.load.image('enfadado','assets/animaciones/boss/Enfadado.png');
  this.load.image('disparo','assets/animaciones/boss/fireball.png');
}

export function animacionBossDesierto() {
  this.physics.anims.create({
      key: 'Walk',
      frames: this.anims.generateFrameNames('Boss_volcan', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
  });
}

export function animacionFuego() {
  this.physics.anims.create({
    key: 'Fuego',
    frames: this.anims.generateFrameNames('fireball', { start: 0, end: 1 }),
    frameRate: 8,
    repeat: -1
  });
}

export function create(obj) {
	
	animacionBossDesierto();

	var boss = this.physics.add.sprite(obj.x,obj.y,'Boss_volcan');
  boss.setScale(2);
	boss.vida = 50;
	boss.fase = 1;
	boss.velocidad = 150;
	boss.frecuencia = 90; // Tiempo entre ataques
	boss.contador = 0;  // Contador de tiempo en el que esta quieto
	boss.posicion = 240; // Espacio lateral de 48 a 528 --> (480)
	boss.direccion = 1; // 0 - Izquierda, 1 - Derecha, 2 - Quieto 
	boss.tiempo = 0; // contador del tiempo entre los ataques
  boss.tiempo2 = 40; // tiempo para las animaciones
	boss.aux = 0;

  boss.play('Walk')
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

  // Tiempo en el que hace la animacion

  if (boss.tiempo2 > 40) {
		boss.play('Walk')
	}

	switch(boss.accion) {
		case 1: // Tres bolas de fuego en forma de cono
			if (boss.tiempo > boss.frecuencia) {
				createConoFuego(boss,0,-1); 		
				createConoFuego(boss,0.5,0.87);		// ( 1/2, -(raiz de 3)/2 )
				createConoFuego(boss,-0.5,0.87);	// ( -1/2, -(raiz de 3)/2 ) 
			
				boss.tiempo = 0;
        boss.tiempo2 = 0;
			}
			else {
				boss.tiempo++;
        boss.tiempo2++;
			}
		
		break;
		case 2: // Una bola de fuego
			if (boss.tiempo > boss.frecuencia) {
				boss.setTexture('disparo');
        createBolaFuego(boss);
				boss.tiempo = 0;
        boss.tiempo2 = 0;
			}
			else {
				boss.tiempo++;
        boss.tiempo2++;
			}
		break;
		case 3: // Ataque de pinzas
			if (boss.tiempo > boss.frecuencia) {
				createFire(boss);
				boss.tiempo = 0;
        boss.tiempo2 = 0;
			}
			else {
				boss.tiempo++;
        boss.tiempo2++;
			}
		break;
		case 4: // Cuatro bolas de fuego
			if (boss.tiempo > boss.frecuencia) {
				boss.setTexture('enfadado');
        createPrision(posicion, 0,tipo, 1 , 0);
				createPrision(-posicion, ,tipo, -1, 0);
				createPrision(0, posicion,tipo, 0, 1);
				createPrision(0, -posicion,tipo, 0, -1);

				boss.tiempo = 0;
        boss.tiempo2 = 0;
			}
			else {
				boss.tiempo++;
        boss.tiempo2++;
			}
		break;
		default: // 5 bolas de fuego en forma de cono
			if (boss.tiempo > boss.frecuencia) {
				boss.setTexture('disparo');
        createConoFuego(boss,0,-1); 		
				createConoFuego(boss,0.5,0.87);		// ( 1/2, -(raiz de 3)/2 )
				createConoFuego(boss,-0.5,0.87);	// ( -1/2, -(raiz de 3)/2 ) 
				createConoFuego(boss,1,-1);			
				createConoFuego(boss,-1,-1);
			
				boss.tiempo = 0;
        boss.tiempo2 = 0;
			}
			else {
				boss.tiempo++;
        boss.tiempo2++;
			}
		break;
	}

	if (boss.vida < 20 && !boss.aux) { // El aux para que no lo lea cada vez que pasa
		
		boss.fase = 2;
		boss.aux = 1;
		boss.velocidad = 200;
		boss.frecuencia = 60;
	}
	else if (boss.vida <= 0) {
		destroyBoss(boss);
	}
	
	for (i = 0; i < shootList.getChildren().length; i++) {
		var fuego = shootList.getChildren()[i];
		if (fuego.persigue) {
		  this.physics.moveTo(fuego,heroes.cabeza.x,heroes.cabeza.y,velocidad_fuego);
	  }
    updateFire(fuego);
	}
}

export function createFireBossGroup() {
	var fireBossList = this.add.group();
}

export function createBolaFuego (boss) {
	
  animacionFuego();
  this.anims.play('Fuego')

	var f = fireList.create(boss.x,boss.y,'Fuego');
	f.tiempo = 0; // El tiempo para que desaparezca
	f.ataque = 1; 
  f.velocidad = 100;

	if (boss.fase == 1) {
		f.persigue = false;
	}
	if (boss.fase == 2) {
		f.persigue = true;
	}

	this.physics.moveTo(f,heroes.cabeza.x,heroes.cabeza.y,f.velocidad); 
}

export function createConoFuego(boss,x,y) {
	
  animacionFuego();

	var f = fireList.create(boss.x,boss.y,'Fuego');
	f.tiempo = 0; // El tiempo para que desaparezca
	f.ataque = 1; 
  f.velocidad = 100;
	f.persigue = false;
	f.setVelocity(x * f.velocidad, y * f.velocidad);

}

export function createPrision(x,y,tipo,dir1,dir2) {
	
  animacionFuego();

	var pos = 0;

	pos.x = heroes.heroes.x + x; 
	pos.y = heroes.heroes.y + y; 

	var f = fireList.create(pos.x,pos.y,'Fuego');
	f.tiempo = 0; // El tiempo para que desaparezca
	f.ataque = 1; 
  f.velocidad = 100;
	f.persigue = false;

	f.setVelocityX(velocidad_fuego * tipo * dir1);
	f.setVelocityY(velocidad_fuego * tipo * dir2);
}

export function updateFire(f) {
	if (f.tiempo > 250) {
		destroyFire(f);
	}
	else {
		f.tiempo++;
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