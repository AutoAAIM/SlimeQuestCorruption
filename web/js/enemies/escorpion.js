import * as robin from '../personajes/robin.js'
import * as heroes from './grupoHeroes.js';

export var inmune = false;

export function preload() {
	this.load.spritesheet('Escorpion','assets/sprites/Escorpion.png');
	// Animacion salir
}

export function animacionEscorpion() {

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

	e.detect = this.add.circle(e.x,e.y,30);
	this.physics.add.existing(e.detect,false);
	e.detect.encontrado = false;

	this.physics.add.overlap(escorpionList, heroes.heroes, detectar, null, this);
}

export function detectar(e,h) {
	e.detect.encontrado = true;
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