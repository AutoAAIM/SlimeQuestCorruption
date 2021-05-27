import * as heroes from '../grupoHeroes.js';

var scene;

export function preload()
{
	this.load.spritesheet('cake', 'assets/images/strange_cake.png', {frameWidth:32, frameHeight:32});
	this.load.image('pan', 'assets/images/pan.png');
	this.load.image('inventario', 'assets/images/inventario.png');

	scene = this;
}

export var grupoCake;
export var grupoPan;

export function create(obj)
{
	grupoPan = scene.physics.add.staticGroup();
	grupoCake = scene.physics.add.staticGroup();

	scene.anims.create({
			key:'lie',
			frames: scene.anims.generateFrameNames('cake'),
			frameRate: 4,
			repeat: -1
		});

	generarInventario(obj);
	generarPan(obj);
	generarPan(obj);
}

export function generarInventario(obj)
{
	imagenInventario = scene.physics.add.sprite(heroes.cabeza.x - config.width / 2 + config.width / 2, heroes.cabeza.y - config.height / 2 + config.height - 50, config.width - 8, 'inventario').setDepth(18);
}

export function generarPan(obj)
{
	var p = grupoPan.create(spawn.x + 30, spawn.x, 'cake').setDepth(20).setPipeline('Light2D');
}

export function generarTarta(obj)
{
	var c = grupoCake.create(spawn.x, spawn.x, 'cake').setDepth(20).setPipeline('Light2D');
	c.play('lie', true);
}

