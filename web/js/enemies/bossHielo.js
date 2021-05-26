import * as juego from './juego.js';
import * as yasha from './yasha.js';

var scene;

export function preload()
{
	this.load.spritesheet('bossHielo', 'assets/sprites/bossHielo.png', {frameWidth:32, frameHeight:32});
	//this.load.image('polvoHielo', 'assets/sprites/polvo.png');

	scene = this;
}

export var boss;
export var grupoDispBoss;

export function create(obj)
{
	scene.anims.create({
			key:'boss',
			frames: scene.anims.generateFrameNames('bossHielo'),
			frameRate: 4,
			repeat: -1
		});

	generarBoss(obj);
}

export function bossTrue(arrayObj)
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

export function generarBoss(obj)
{
	boss = scene.physics.add.staticSprite(obj.x, obj.y, 'bossHielo').setDepth(2).setPipeline('Light2D');
	boss.setSize(30, 39);
	boss.setScale(5);
	boss.play('boss', true);

	grupoDispBoss = scene.physics.add.group();

	boss.detectionbox = scene.add.rectangle(boss.x, boss.y, 400, 400);
	scene.physics.add.existing(boss.detectionbox, false);

	boss.detectionbox.tiempoDisparo = 0;

	scene.physics.add.overlap(yasha.player, boss.detectionbox, generarNieblaBoss, null, scene);
}

function generarNieblaBoss(py,boss)
{
	if(boss.tiempoDisparo <= 0)
	{
		boss.tiempoDisparo = 1;

		var d = grupoDispBoss.create(boss.x - 15, boss.y + 5, 'polvoHielo').setDepth(2).setPipeline('Light2D');

	 	d.setAlpha(0.3);

	 	d.angle = Phaser.Math.Between(-180, 180)
		var dir = new Phaser.Math.Vector2(Math.cos(d.angle*Math.PI/180), Math.sin(d.angle*Math.PI/180));
		dir.normalize();

		d.setVelocityX(30*dir.x);
		d.setVelocityY(30*dir.y);

		d.tiempoVida = 300;
	}

	boss.tiempoDisparo--;
}

export function updateNieblaBoss()
{
	Phaser.Actions.Call(grupoDispBoss.getChildren(),function(d)
	{
		d.tiempoVida--;
		if(d.tiempoVida <= 0)
		{
			d.destroy();
		}
	});
}