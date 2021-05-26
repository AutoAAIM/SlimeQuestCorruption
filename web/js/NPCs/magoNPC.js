import * as juego from './juego.js';
import * as yasha from './yasha.js';

var scene;

export function preload()
{
	this.load.spritesheet('magoHielo', 'assets/sprites/magoHielo.png', {frameWidth:88, frameHeight:44});

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
}