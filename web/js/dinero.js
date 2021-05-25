import * as heroes from './grupoHeroes.js';

var grupoDinero;
var scene;

export function preload()
{
	this.load.image('plort','assets/particles/plort.png');
	scene = this;
}

export function create()
{
	grupoDinero = scene.physics.add.group();

	scene.physics.add.overlap(heroes.heroes, grupoDinero, recogerPlort, null, scene);
}

export function generarPlort(vector, cantidad)
{
	for(var i; i < cantidad; i++)
	{
		
		var p = grupoDinero.create(vector.x + Paser.Math.Between(-10,10), vector.y + Paser.Math.Between(-10,10), 'plort');
		s.setTint(0xaaaaaa)
	}
}

function recogerPlort(pj, pl)
{
	pl.destroy();
	incrementarPlorts = 1;
}

function incrementarPlorts (cantidad)
{
	var plorts += cantidad;
}