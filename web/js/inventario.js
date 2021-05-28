import * as heroes from './grupoHeroes.js';
import * as sc from './sceneConstructor.js';

var scene;
var imagenInventario;

export function preload()
{
	this.load.spritesheet('cake', 'assets/images/strange_cake.png', {frameWidth:32, frameHeight:32});
	this.load.image('pan', 'assets/images/pan.png');
	this.load.image('inventarios', 'assets/images/tablaInventario.png');

	scene = this;
}

export var grupoCake;
export var grupoPan;

export function create()
{
	grupoPan = scene.physics.add.staticGroup();
	grupoCake = scene.physics.add.staticGroup();

	scene.anims.create({
			key:'lie',
			frames: scene.anims.generateFrameNames('cake'),
			frameRate: 4,
			repeat: -1
		});

	generarInventario();
	generarPan();
	generarPan();
}

export function generarInventario()
{
	imagenInventario = scene.add.sprite(sc.config.width / 2,sc.config.height - 18, 'inventarios').setDepth(18).setScrollFactor(0);
}

export function generarPan()
{
	//var p = grupoPan.create(spawn.x + 30, spawn.x, 'cake').setDepth(20).setPipeline('Light2D');
}

export function generarTarta()
{
	//var c = grupoCake.create(spawn.x, spawn.x, 'cake').setDepth(20).setPipeline('Light2D');
	//c.play('lie', true);
}

