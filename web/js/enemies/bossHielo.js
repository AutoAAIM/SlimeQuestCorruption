import * as juego from '../mapas/snowyMountain.js';
import * as utilidades from '../utilidades.js';
import * as dinero from '../dinero.js';
import * as heroes from '../grupoHeroes.js';

var scene;

export function preload()
{
	this.load.spritesheet('bossHielo', 'assets/images/bossHielo.png', {frameWidth:32, frameHeight:32});

	scene = this;
}

export var boss;
export var grupoDispBoss;

export function update()
{
	if(boss.vida <= 0)
	{
		boss.destroy;
	}
}

export function create(obj)
{
	scene.anims.create({
			key:'boss',
			frames: scene.anims.generateFrameNames('bossHielo'),
			frameRate: 2,
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
	boss = scene.physics.add.staticSprite(obj.x, obj.y, 'bossHielo').setDepth(5).setPipeline('Light2D');
	boss.setSize(30, 39);
	boss.setScale(5);
	boss.play('boss', true);
	boss.activo = false;
	boss.setAlpha(0);
	boss.body.enable = false;
	boss.vida = 30;

	grupoDispBoss = scene.physics.add.group();

	boss.detectionbox = scene.add.rectangle(boss.x, boss.y, 400, 400);
	scene.physics.add.existing(boss.detectionbox, false);

	boss.detectionbox.tiempoDisparo = 0;
	boss.detectionbox.delayDisparo = 0;

	scene.physics.add.overlap(heroes.heroes, boss.detectionbox, generarNieblaBoss, null, scene);

	boss.detectionbox.body.enable = false;
}

function generarNieblaBoss(boss, py)
{
	if(boss.tiempoDisparo <= 0 && boss.delayDisparo <= 0)
	{
		boss.tiempoDisparo = 1;

		if(boss.delayDisparo <= -120)
		{
			boss.delayDisparo = 600;
		}

		var d = grupoDispBoss.create(boss.x - 15, boss.y + 5, 'polvoHielo').setDepth(5).setPipeline('Light2D');

	 	d.setAlpha(0.3);

	 	d.angle = Phaser.Math.Between(-180, 180)
		var dir = new Phaser.Math.Vector2(Math.cos(d.angle*Math.PI/180), Math.sin(d.angle*Math.PI/180));
		dir.normalize();

		d.setVelocityX(30*dir.x);
		d.setVelocityY(30*dir.y);

		d.tiempoVida = 360;
	}

	boss.tiempoDisparo--;
	boss.delayDisparo--;
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

export function quitarVida(obj, e)
{
	if (!e.inmune)
	{
		e.detectionbox.detectado = true;

		if (obj.dano != null) 
		{
			e.vida -= obj.dano;
		}
		else
		{
			e.vida --;
		}

		e.inmune = true;

		scene.tweens.addCounter({
			from: 100,
			to: 0,
			duration: 1000,

			onUpdate: function (tween) {
				var value = Math.floor(tween.getValue());

				e.inmune = true;

				e.setAlpha(value % 2)

				if (value == 0) {
					e.setAlpha(1)
					e.inmune = false;
				}
			}
		});
	}
	if(obj.fragil)
	{
		obj.destroy()
	}
}