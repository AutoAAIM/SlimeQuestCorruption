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

export var grupoObjetos;
export var grupoDrops;
var huecos = new Array;

export function create()
{
	grupoObjetos = scene.physics.add.staticGroup();
	grupoDrops = scene.physics.add.group();

	scene.anims.create({
			key:'lie',
			frames: scene.anims.generateFrameNames('cake', { start: 0, end: 9 }),
			frameRate: 4,
			repeat: -1
		});

	generarInventario();

	scene.physics.add.overlap(heroes.heroes, grupoDrops, tirarItem, null, scene);
	//grupoDrops
}

export function generarInventario()
{
	imagenInventario = scene.add.sprite(sc.config.width / 2,sc.config.height - 19, 'inventarios').setDepth(18).setScrollFactor(0);

	dineroText = scene.add.text(sc.config.width / 2 + 68, 264, scene.game.usuario.dinero, {fontSize: '10px', fill: '#FFFFFF', fontFamily: 'sans-serif'}).setDepth(19).setScrollFactor(0);

	huecos[0] = new Phaser.Geom.Point(imagenInventario.x - 73, imagenInventario.y);
	huecos[1] = new Phaser.Geom.Point(imagenInventario.x - 37, imagenInventario.y);
	huecos[2] = new Phaser.Geom.Point(imagenInventario.x - 1, imagenInventario.y);
	huecos[3] = new Phaser.Geom.Point(imagenInventario.x + 35, imagenInventario.y);

	if(scene.game.usuario.inventario1 == "pan"){generarPan()}
	else if(scene.game.usuario.inventario1 == "pastelraro"){generarTarta()}

	if(scene.game.usuario.inventario2 == "pan"){generarPan()}
	else if(scene.game.usuario.inventario2 == "pastelraro"){generarTarta()}

	if(scene.game.usuario.inventario3 == "pan"){generarPan()}
	else if(scene.game.usuario.inventario3 == "pastelraro"){generarTarta()}

	if(scene.game.usuario.inventario4 == "pan"){generarPan()}
	else if(scene.game.usuario.inventario4 == "pastelraro"){generarTarta()}
}

export function update()
{
	dineroText.setText(scene.game.usuario.dinero);
}

export function generarPan()
{
	var indice = grupoObjetos.getLength();
	if(indice < huecos.length)
	{
		var p = grupoObjetos.create(huecos[indice].x, huecos[indice].y, 'pan').setDepth(20).setScrollFactor(0);
		p.curacion = 4;
		p.name = "pan"

		p.setInteractive();
		p.on('pointerdown', function (puntero) {
			var obj = p;
			consumir(puntero, obj);
		});
	}
}

export function generarTarta()
{
	var indice = grupoObjetos.getLength();
	if(indice < huecos.length)
	{
		var c = grupoObjetos.create(huecos[indice].x, huecos[indice].y, 'cake').setDepth(20).setScrollFactor(0);
		c.play('lie', true);
		c.curacion = 8;
		c.name = "pastelraro"

		c.setInteractive();
		c.on('pointerdown', function (puntero, obj) {
			var obj = c;
			consumir(puntero, obj);
		});
	}
}

export function consumir(puntero, obj)
{
	if(obj.curacion != undefined)
	{
		Phaser.Actions.Call(heroes.heroes.getChildren(), function (pj) {
			pj.vida += obj.curacion;
			if(pj.vida > pj.maxVida)
			{
				pj.vida = pj.maxVida;
			}
		});
	}
	obj.destroy();

	for(var i = 0; i < grupoObjetos.getLength(); i++)
	{
		grupoObjetos.getChildren()[i].x = huecos[i].x
		grupoObjetos.getChildren()[i].y = huecos[i].y
	}
}

export function tirarPan(obj)
{
	//var indice = grupoDrops.getLength();

	var p = grupoDrops.create(obj.x, obj.y, 'pan').setDepth(17);
	p.name = "pan"
}