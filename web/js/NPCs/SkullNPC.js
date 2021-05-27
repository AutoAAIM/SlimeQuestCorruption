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

	scene = this;
}

export function create(obj, conf)
{
	scene.anims.create({
		key: 'SkullAGAnim',
		frames: this.anims.generateFrameNumbers('Skull'),
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
		cuadroTexto.x = heroes.cabeza.x - config.width / 2 + config.width / 2;
		cuadroTexto.y = heroes.cabeza.y - config.height / 2 + config.height - 50;

		cuadroTexto2.x = heroes.cabeza.x - config.width / 2 + config.width / 2;
		cuadroTexto2.y = heroes.cabeza.y - config.height / 2 + config.height - 50;

		scene.skullText.x = heroes.cabeza.x - config.width / 2 + 16;
		scene.skullText.y = heroes.cabeza.y - config.height / 2 + 210;

		imagenTexto.x = heroes.cabeza.x - config.width / 2 + 340;
		imagenTexto.y = heroes.cabeza.y - config.height / 2 + 240;

		if(Phaser.Geom.Intersects.RectangleToRectangle(heroes.cabeza.getBounds(), skull.detectionbox.getBounds()))
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

export function generarSkull(obj)
{
	skull = scene.physics.add.staticSprite(obj.x, obj.y, 'skull').setDepth(5);
	skull.setSize(30, 39);
	skull.play('SkullAGAnim', true);

	skull.detectionbox = scene.add.rectangle(skull.x, skull.y, 180, 180);
	scene.physics.add.existing(skull.detectionbox, false);

	skull.body.enable = false;
	skull.detectionbox.body.enable = false;
	skull.setAlpha(0);

	scene.physics.add.overlap(heroes.heroes, skull.detectionbox, encenderHielito, null, scene);
}