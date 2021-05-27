import * as yasha from '../personajes/yasha.js';
import * as heroes from '../grupoHeroes.js';
import * as bossHielo from '../enemies/bossHielo.js';

var scene;
var textoMago = false;
var cuadroTexto;
var cuadroTexto2;
var imagenTexto;
var config;

export function preload()
{
	this.load.spritesheet('magoHielo', 'assets/images/magoHielo.png', {frameWidth:88, frameHeight:44});
	this.load.image('textoHielo', 'assets/images/hieloTexto.png');

	scene = this;
}

export var mago;

export function create(obj, conf)
{
	scene.anims.create({
			key:'magia',
			frames: scene.anims.generateFrameNames('magoHielo'),
			frameRate: 4,
			repeat: -1
		});

	generarMago(obj);

	config = conf;
}
export function update()
{
	updateTexto();
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
		scene.magoText.y = yasha.player.y - config.height / 2 + 210;

		imagenTexto.x = yasha.player.x - config.width / 2 + 340;
		imagenTexto.y = yasha.player.y - config.height / 2 + 240;

		if(Phaser.Geom.Intersects.RectangleToRectangle(yasha.player.getBounds(), mago.detectionbox.getBounds()))
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
	//console.log(yasha.player.hieloTrue)

	if(textoMago == false)
	{
		cuadroTexto = scene.add.rectangle(yasha.player.x - config.width / 2 + config.width / 2, yasha.player.y - config.height / 2 + config.height - 50, config.width, 100, 0xaaaaaa).setDepth(16);

		cuadroTexto2 = scene.add.rectangle(yasha.player.x - config.width / 2 + config.width/2, yasha.player.y - config.height / 2 + config.height - 50, config.width-8, 100 - 8, 0x000000).setDepth(17);

		scene.magoText = scene.add.text(yasha.player.x - config.width / 2 + 16, yasha.player.y - config.height / 2 + 210, 'Mago: \nOtro novato en busca de poder... \nToma esto y dejame en paz.', {fontSize: '12px', fill: '#FFFFFF', fontFamily: 'sans-serif'}).setDepth(18);

		imagenTexto = scene.physics.add.sprite(yasha.player.x - config.width / 2 + 340, yasha.player.y - config.height / 2 + 240, 'textoHielo').setDepth(18).setScale(2);
	}

	generarBoss(obj);

	textoMago = true;
}

export function generarMago(obj)
{
	mago = scene.physics.add.staticSprite(obj.x, obj.y, 'magoHielo').setDepth(5).setPipeline('Light2D');
	mago.setSize(30, 39);
	mago.play('magia', true);

	mago.detectionbox = scene.add.rectangle(mago.x, mago.y, 180, 180);
	scene.physics.add.existing(mago.detectionbox, false);

	mago.body.enable = false;
	mago.detectionbox.body.enable = false;
	mago.setAlpha(0);

	scene.physics.add.overlap(heroes.heroes, mago.detectionbox, encenderHielito, null, scene);
}

