import * as heroes from '../grupoHeroes.js';

var scene;
var textoSkull = false;
var cuadroTexto;
var cuadroTexto2;
var imagenTexto;
var config;
var skull;

export function preload()
{
	this.load.spritesheet('Skull','assets/images/SkullAG.png', { frameWidth: 32, frameHeight: 48});
	this.load.spritesheet('cakeTienda', 'assets/images/strange_cake.png', {frameWidth:32, frameHeight:32});
	this.load.image('panTienda', 'assets/images/pan.png');

	scene = this;
}

export function create(obj, conf)
{
	scene.anims.create({
		key: 'SkullAGAnim',
		frames: scene.anims.generateFrameNumbers('Skull'),
		frameRate: 4,
		repeat: -1
	});

	generarSkull(obj);

	config = conf;
}

export function encenderTienda()
{
	if(textoSkull == false)
	{
		cuadroTexto = scene.add.rectangle(heroes.cabeza.x - config.width / 2 + config.width / 2, heroes.cabeza.y - config.height / 2 + config.height - 50, config.width, 100, 0xaaaaaa).setDepth(16);

		cuadroTexto2 = scene.add.rectangle(heroes.cabeza.x - config.width / 2 + config.width / 2, heroes.cabeza.y - config.height / 2 + config.height - 50, config.width - 8, 100 - 8, 0x000000).setDepth(17);

		scene.skullText = scene.add.text(heroes.cabeza.x - config.width / 2 + 16, heroes.cabeza.y - config.height / 2 + 210, 'Skull: Ayudadme a financiar el laborarorio!\nusad los numeros para comprar. \n1.pan = 15 Plorts          \n2.pastel = 50 Plorts', {fontSize: '12px', fill: '#68FF00', fontFamily: 'sans-serif'}).setDepth(18);
	}

	textoSkull = true;
}

export function update()
{
	updateTexto();
}

function updateTexto()
{
	if(cuadroTexto != undefined)
	{
		cuadroTexto.x = heroes.cabeza.x - config.width / 2 + config.width / 2;
		cuadroTexto.y = heroes.cabeza.y - config.height / 2 + config.height - 50;

		cuadroTexto2.x = heroes.cabeza.x - config.width / 2 + config.width / 2;
		cuadroTexto2.y = heroes.cabeza.y - config.height / 2 + config.height - 50;

		scene.skullText.x = heroes.cabeza.x - config.width / 2 + 16;
		scene.skullText.y = heroes.cabeza.y - config.height / 2 + 210;

		//imagenTexto.x = heroes.cabeza.x - config.width / 2 + 340;
		//imagenTexto.y = heroes.cabeza.y - config.height / 2 + 240;

		if(Phaser.Geom.Intersects.RectangleToRectangle(heroes.cabeza.getBounds(), skull.detectionbox.getBounds()))
		{
			cuadroTexto.setAlpha(1)
			cuadroTexto2.setAlpha(1)
			scene.skullText.setAlpha(1)
			//imagenTexto.setAlpha(1)
		}
		else{
			cuadroTexto.setAlpha(0)
			cuadroTexto2.setAlpha(0)
			scene.skullText.setAlpha(0)
			//imagenTexto.setAlpha(0)
		}

	}
}

//#68FF00

export function generarSkull(obj)
{
	skull = scene.physics.add.staticSprite(obj.x, obj.y, 'skull').setDepth(5);
	skull.setSize(30, 39);
	skull.play('SkullAGAnim', true);

	skull.detectionbox = scene.add.rectangle(skull.x, skull.y, 180, 180);
	scene.physics.add.existing(skull.detectionbox, false);

	//skull.body.enable = false;
	//skull.detectionbox.body.enable = false;
	//skull.setAlpha(0);

	scene.physics.add.overlap(heroes.heroes, skull.detectionbox, encenderTienda, null, scene);
}