import * as heroes from './grupoHeroes.js';
import * as sc from './sceneConstructor.js';

var scene;
var imagenInventario;
var dineroText;

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
			frames: scene.anims.generateFrameNames('cake', { start: 0, end: 9 }),
			frameRate: 4,
			repeat: -1
		});

	generarInventario();
}

export function generarInventario()
{
	imagenInventario = scene.add.sprite(sc.config.width / 2,sc.config.height - 19, 'inventarios').setDepth(18).setScrollFactor(0);

	dineroText = scene.add.text(sc.config.width / 2 + 68, 262, scene.game.usuario.dinero, {fontSize: '10px', fill: '#FFFFFF', fontFamily: 'sans-serif'}).setDepth(19).setScrollFactor(0);

	huecos[0] = new Phaser.Geom.Point(imagenInventario.x - 73, imagenInventario.y);
	huecos[1] = new Phaser.Geom.Point(imagenInventario.x - 37, imagenInventario.y);
	huecos[2] = new Phaser.Geom.Point(imagenInventario.x - 1, imagenInventario.y);
	huecos[3] = new Phaser.Geom.Point(imagenInventario.x + 35, imagenInventario.y);
	generarTarta(huecos[0]);
	generarPan(huecos[1]);
}

export function update()
{
	dineroText.setText(scene.game.usuario.dinero);
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

