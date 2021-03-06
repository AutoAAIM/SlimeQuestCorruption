import * as heroes from './grupoHeroes.js';
import * as inventario from './inventario.js';

var grupoDinero;
export var dinero;
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

	dinero = scene.game.usuario.dinero
}

export function generarPlort(vector, cantidad)
{
	for(var i = 0; i < cantidad; i++)
	{
		
		var p = grupoDinero.create(vector.x + Phaser.Math.Between(-16,16), vector.y + Phaser.Math.Between(-16,16), 'plort').setDepth(30);
		p.setTint(Phaser.Display.Color.GetColor(Phaser.Math.Between(0,255), Phaser.Math.Between(0,255), Phaser.Math.Between(0,255)))
	}
}

function recogerPlort(pj, pl)
{
	pl.destroy();
	incrementarPlorts(1);
}

export function incrementarPlorts (cantidad)
{
	if(typeof scene.game.usuario.dinero === 'string')
	{
		scene.game.usuario.dinero = parseInt(scene.game.usuario.dinero)
	}
	scene.game.usuario.dinero += cantidad;
	dinero = scene.game.usuario.dinero
	inventario.update();
}