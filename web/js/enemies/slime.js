import * as robin from '../personajes/robin.js'
import * as heroes from './grupoHeroes.js';

export var inmune = false;

export function preload() {
	this.load.spritesheet('Slime','assets/sprites/slime.png');
	this.load.spritesheet('Fuego','assets/sprites/fire.png');
}

export function animacionSlime() {

}

export function createSlimeGroup(pared) {
	var slimeList = this.add.group();
	this.physics.add.collider(slimeList,slimeList);
	this.physics.add.collider(slimeList,pared);
}

export function createSuperSlimeGroup(pared) {
	var superSlimeList = this.add.group();
	this.physics.add.collider(superSlimeList,superSlimeList);
	this.physics.add.collider(superSlimeList,pared);
}

export function createSlime(s) {
	
	animacionSlime();

	var s = slimeList.create(s.x,s.y,'Slime');

	s.vida = 4;
	s.buscar = false;
	s.ataque = 1;
	s.velocidad = 20;
	s.contador = 0;
	
	s.circulo = this.add.circle(s.x,s.y,30);
	this.physics.add.existing(s.circulo,false);
	s.circulo.encontrado = false;

	this.physics.add.overlap(slimeList, heroes.heroes, detectarHeroe, null, this);
}

export function createSuperSlime(ss) {
	
	animacionSlime();

	var ss = slimeList.create(ss.x,ss.y,'Slime').setScale(2);

	ss.vida = 8;
	ss.buscar = false;
	ss.ataque = 1;
	ss.velocidad = 10;
	ss.contador = 0;
	
	ss.circulo = this.add.circle(ss.x,ss.y,50);
	this.physics.add.existing(ss.circulo,false);
	ss.circulo.encontrado = false;

	this.physics.add.overlap(superSlimeList, heroes.heroes, detectarHeroe, null, this);
}

export function detectarHeroe(slime,h) {
	slime.circulo.encontrado = true;
}

export function updateSlime(s) {

	if (s.circulo.encontrado) {
		s.perseguir = true;
	}
	else {
		s.perseguir = false;
		s.contador = 0;
	}
	if (s.perseguir) {
		
		if (s.contador == 0) {
			createFire();
		}
		else if (s.contador < 20) {
			s.contador++;
		}
		else if (s.contador > 20 && s.contador < 50) {
			this.physics.moveTo(s,heroes.cabeza.x,heroes.cabeza.y,s.velocidad);
			s.contador++;
		}
		else if (contador >= 50) {
			s.contador = 0;
		}
	}
}

export function updateSuperSlime(ss) { 

	if (ss.circulo.encontrado) {
		ss.perseguir = true;
	}
	else {
		ss.perseguir = false;
		ss.contador = 0;
	}
	if (ss.perseguir) {
		if (ss.contador == 0) {
			createFire();
		}
		else if (ss.contador < 20) {
			ss.contador++;
		}
		else if (ss.contador > 20 && ss.contador < 40) {
			this.physics.moveTo(ss,heroes.cabeza.x,heroes.cabeza.y,ss.velocidad);
			ss.contador++;
		}
		else if (ss.contador >= 40) {
			ss.contador = 0;
		}
	}
}

export function updateVidaSlime(s) {
	if (!s.inmune && s.vida > 0) {
		
		s.vida--;
		
		scene.tweens.addCounter({
			from: 100,
			to: 0,
			duration: 1000,
			onUpdate: function (tween) {
				var value = Math.floor(tween.getValue());

				s.inmune = true;

				s.setAlpha(value % 2)

				if (value == 0) {
					s.setAlpha(1)
					s.inmune = false;
				}
			}
		});
	}
	else if (s.vida <= 0) {
		destroySlime(s);
	}
	
}

export function destroySlime(slime) {
	slime.detect.destroy();
	slime.body.enable = false;
	slimeList.remove(slime);
}

export function updateVidasuperSlime(ss) {
	if (!ss.inmune && ss.vida > 0) {
		ss.vida--;
		scene.tweens.addCounter({
			from: 100,
			to: 0,
			duration: 1000,
			onUpdate: function (tween) {
				var value = Math.floor(tween.getValue());

				ss.inmune = true;

				ss.setAlpha(value % 2)

				if (value == 0) {
					ss.setAlpha(1)
					ss.inmune = false;
				}
			}
		});
	}
	else if (ss.vida <= 0) {
		destroySuperSlime(ss);
	}
	
}

export function destroySuperSlime(ss) {
	createSlime(ss);
	createSlime(ss);
	ss.detect.destroy();
	ss.body.enable = false;
	superSlimeList.remove(ss);
}

export function createFireGroup(pared) {
	var fireList = this.add.group();
	this.physics.add.collider(fireList,pared);
}

export function createFire(s) {
	var f = fireList.create(s.x,s.y,'Fuego');
	f.tiempo = 0;
	f.velocidad = 60;
	f.ataque = 1;

	this.physics.moveTo(f,heroes.cabeza.x,heroes.cabeza.y,velocidad);
}

export function updateFire(f) {
	if (f.tiempo > 50) {
		f.destroy();
		f.body.enable = false;
	}
	else {
		f.tiempo++;
	}
}