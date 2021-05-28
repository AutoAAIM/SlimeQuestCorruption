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
var huecos = new Array;

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
}

export function generarInventario()
{
	imagenInventario = scene.add.sprite(sc.config.width / 2,sc.config.height - 19, 'inventarios').setDepth(18).setScrollFactor(0);

	huecos[0] = new Phaser.Geom.Point(imagenInventario.x - 0, imagenInventario.y);
	huecos[1] = new Phaser.Geom.Point(imagenInventario.x - 0, imagenInventario.y);
	huecos[2] = new Phaser.Geom.Point(imagenInventario.x + 0, imagenInventario.y);
	huecos[3] = new Phaser.Geom.Point(imagenInventario.x + 0, imagenInventario.y);
	generarTarta(huecos[2]);
}

export function generarPan(obj)
{
	var p = grupoPan.create(obj.x, obj.y, 'pan').setDepth(20).setScrollFactor(0);
}

export function generarTarta(obj)
{
	var c = grupoCake.create(obj.x, obj.y, 'cake').setDepth(20).setScrollFactor(0);
	c.play('lie', true);
}

