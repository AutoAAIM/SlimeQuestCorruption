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

export function generarPlort(cantidad)
{
	for(var i; i < cantidad; i++)
	{
		
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