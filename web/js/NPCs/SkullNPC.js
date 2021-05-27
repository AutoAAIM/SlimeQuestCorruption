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

	scene = this;
}

export function create(obj, conf)
{
	scene.anims.create({
			key:'magia',
			frames: scene.anims.generateFrameNames('magoHielo'),
			frameRate: 4,
			repeat: -1
		});

	generarSkull(obj);

	config = conf;
}
export function update()
{
	updateTexto();
}

function updateTexto()
{
	if(cuadroTexto != undefined)
	{
		cuadroTexto.x = yasha.player.x - config.width / 2 + config.width / 2;
		cuadroTexto.y = yasha.player.y - config.height / 2 + config.height - 50;

		cuadroTexto2.x = yasha.player.x - config.width / 2 + config.width / 2;
		cuadroTexto2.y = yasha.player.y - config.height / 2 + config.height - 50;

		scene.skullText.x = yasha.player.x - config.width / 2 + 16;
		scene.skullText.y = yasha.player.y - config.height / 2 + 210;

		imagenTexto.x = yasha.player.x - config.width / 2 + 340;
		imagenTexto.y = yasha.player.y - config.height / 2 + 240;

		if(Phaser.Geom.Intersects.RectangleToRectangle(yasha.player.getBounds(), skull.detectionbox.getBounds()))
		{
			cuadroTexto.setAlpha(1)
			cuadroTexto2.setAlpha(1)
			scene.skullText.setAlpha(1)
			imagenTexto.setAlpha(1)
		}
		else{
			cuadroTexto.setAlpha(0)
			cuadroTexto2.setAlpha(0)
			scene.skullText.setAlpha(0)
			imagenTexto.setAlpha(0)
		}

	}
}

export function encenderHielito()
{
	scene.game.yashaActivarCuracion = true
	
	if(textoSkull == false)
	{
		bossHielo.boss.activo = true;
		bossHielo.boss.setAlpha(1);
		bossHielo.boss.body.enable = true;
		bossHielo.boss.detectionbox.body.enable = true;

		cuadroTexto = scene.add.rectangle(yasha.player.x - config.width / 2 + config.width / 2, yasha.player.y - config.height / 2 + config.height - 50, config.width, 100, 0xaaaaaa).setDepth(16);

		cuadroTexto2 = scene.add.rectangle(yasha.player.x - config.width / 2 + config.width / 2, yasha.player.y - config.height / 2 + config.height - 50, config.width - 8, 100 - 8, 0x000000).setDepth(17);

		scene.skullText = scene.add.text(yasha.player.x - config.width / 2 + 16, yasha.player.y - config.height / 2 + 210, 'Skull: saludos heroes! \nComprad, debo financiar el laboratorio, {fontSize: '12px', fill: '#FFFFFF', fontFamily: 'sans-serif'}).setDepth(18);

		//imagenTexto = scene.physics.add.sprite(yasha.player.x - config.width / 2 + 340, yasha.player.y - config.height / 2 + 240, 'textoHielo').setDepth(18).setScale(2);
	}

	textoSkull = true;
}

export function generarSkull(obj)
{
	skull = scene.physics.add.staticSprite(obj.x, obj.y, 'skull').setDepth(5);
	skull.setSize(30, 39);
	skull.play('magia', true);

	mago.detectionbox = scene.add.rectangle(mago.x, mago.y, 180, 180);
	scene.physics.add.existing(mago.detectionbox, false);

	mago.body.enable = false;
	mago.detectionbox.body.enable = false;
	mago.setAlpha(0);

	scene.physics.add.overlap(heroes.heroes, mago.detectionbox, encenderHielito, null, scene);
}