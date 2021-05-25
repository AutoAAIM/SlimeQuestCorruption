import * as heroes from './grupoHeroes.js';

var grupoDinero;
var scene;

export function preload()
{
	this.load.image('plort','assets/images/plort.png');
	scene = this;
}

export function create()
{
	grupoDinero = scene.physics.add.group();

	scene.physics.add.overlap(heroes.heroes, grupoDinero, recogerPlort, null, scene);
}

export function generarPlort(vector, cantidad)
{
	for(var i = 0; i < cantidad; i++)
	{
		
		var p = grupoDinero.create(vector.x + Phaser.Math.Between(-10,10), vector.y + Phaser.Math.Between(-10,10), 'plort').setDepth(30);
		p.setTint(Phaser.Display.Color.GetColor(Phaser.Math.Between(0,255), Phaser.Math.Between(0,255), Phaser.Math.Between(0,255)))
	}
}

function recogerPlort(pj, pl)
{
	pl.destroy();
	incrementarPlorts(1);
}

function incrementarPlorts (cantidad)
{
	if(typeof scene.game.usuario.dinero === 'string')
	{
		scene.game.usuario.dinero = parseInt(scene.game.usuario.dinero)
	}
	scene.game.usuario.dinero += cantidad;
	//console.log('guarra');
}