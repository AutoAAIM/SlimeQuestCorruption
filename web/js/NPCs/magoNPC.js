import * as yasha from '../personajes/yasha.js';
import * as heroes from '../grupoHeroes.js';

var scene;

export function preload()
{
	this.load.spritesheet('magoHielo', 'assets/images/magoHielo.png', {frameWidth:88, frameHeight:44});

	scene = this;
}

export var mago;

export function create(obj)
{
	scene.anims.create({
			key:'magia',
			frames: scene.anims.generateFrameNames('magoHielo'),
			frameRate: 4,
			repeat: -1
		});

	generarMago(obj);
}

export function magoTrue(arrayObj)
{
	var arrayObjEncencido = true;

	for(var i = 0; i < arrayObj.length; i++)
	{
		if(arrayObj[i].encendido == false)
		{
			arrayObjEncencido = false;
		}
	}

	if(arrayObjEncencido == true)
	{
		mago.body.enable = true;
		mago.detectionbox.body.enable = true;
		mago.setAlpha(1);
	}
}

function updateTexto()
{
	if(cuadroTexto != undefined)
	{
		cuadroTexto.x = yasha.player.x - config.width / 2 + config.width / 2;
		cuadroTexto.y = yasha.player.y - config.height / 2 + config.height - 50;

		cuadroTexto2.x = yasha.player.x - config.width / 2 + config.width / 2;
		cuadroTexto2.y = yasha.player.y - config.height / 2 + config.height - 50;

		scene.magoText.x = yasha.player.x - config.width / 2 + 16;
		scene.magoText.y = yasha.player.y - config.height / 2 + 310;

		imagenTexto.x = yasha.player.x - config.width / 2 + 540;
		imagenTexto.y = yasha.player.y - config.height / 2 + 350;

		if(Phaser.Geom.Intersects.RectangleToRectangle(yasha.player.getBounds(), mago.mago.detectionbox.getBounds()))
		{
			cuadroTexto.setAlpha(1)
			cuadroTexto2.setAlpha(1)
			scene.magoText.setAlpha(1)
			imagenTexto.setAlpha(1)
		}
		else{
			cuadroTexto.setAlpha(0)
			cuadroTexto2.setAlpha(0)
			scene.magoText.setAlpha(0)
			imagenTexto.setAlpha(0)
		}

	}
}

export function encenderHielito()
{
	yasha.player.hieloTrue = true;

	if(textoMago == false)
	{
		cuadroTexto = scene.add.rectangle(yasha.player.x - config.width / 2 + config.width / 2, yasha.player.y - config.height / 2 + config.height - 50, config.width, 100, 0xaaaaaa).setDepth(16);

		cuadroTexto2 = scene.add.rectangle(yasha.player.x - config.width / 2 + config.width/2, yasha.player.y - config.height / 2 + config.height - 50, config.width-8, 100 - 8, 0x000000).setDepth(17);

		scene.magoText = scene.add.text(yasha.player.x - config.width / 2 + 16, yasha.player.y - config.height / 2 + 310, 'Mago: \nOtro novato en busca de poder... \nToma esto y dejame en paz.', {fontSize: '12px', fill: '#FFFFFF', fontFamily: 'sans-serif'}).setDepth(18);

		imagenTexto = scene.physics.add.sprite(yasha.player.x - config.width / 2 + 540, yasha.player.y - config.height / 2 + 330, 'textoHielo').setDepth(18).setScale(2);
	}

	textoMago = true;
}

export function generarMago(obj)
{
	mago = scene.physics.add.staticSprite(obj.x, obj.y, 'magoHielo').setDepth(2).setPipeline('Light2D');
	mago.setSize(30, 39);
	mago.play('magia', true);

	mago.detectionbox = scene.add.rectangle(mago.x, mago.y, 180, 180);
	scene.physics.add.existing(mago.detectionbox, false);

	mago.body.enable = false;
	mago.detectionbox.body.enable = false;
	mago.setAlpha(0);

	scene.physics.add.overlap(heroes.heroes, mago.detectionbox, encenderHielito, null, scene);
}

