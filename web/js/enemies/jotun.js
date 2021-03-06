import * as heroes from '../grupoHeroes.js';
import * as dinero from '../dinero.js';

var scene;

export function preload()
{
	this.load.spritesheet('enemigoJotun', 'assets/images/jotun.png', {frameWidth:32, frameHeight:32});
	this.load.image('polvoHielo', 'assets/particles/polvo.png');

	scene = this;
}

export var grupoEnemigos
export var grupoDispEnemigo

export function update()
{
	for(var i = grupoEnemigos.getLength() - 1; i >= 0; i--)
	{
		if(grupoEnemigos.getChildren()[i].vida <= 0)
		{
			grupoEnemigos.getChildren()[i].destroy;
		}
		// console.log(grupoEnemigos.getChildren()[i].vida);
	}
}

export function create(obj)
{
	grupoEnemigos = scene.physics.add.staticGroup();
	grupoDispEnemigo = scene.physics.add.group();

	scene.anims.create({
			key:'slime',
			frames: scene.anims.generateFrameNames('enemigoJotun'),
			frameRate: 4,
			repeat: -1
		});
}

export function generarEnemigo(obj)
{
	var e = grupoEnemigos.create(obj.x, obj.y, 'enemigoJotun').setDepth(5).setPipeline('Light2D');
	e.setScale(2);
	e.setCircle(22);
	e.play('slime', true);
    e.dano = 1
    e.inmune = false;
	e.detectionbox = scene.add.rectangle(e.x, e.y, 290, 290);
	scene.physics.add.existing(e.detectionbox, false);
	e.vida = 6;

	e.detectionbox.tiempoDisparo = 0;

	scene.physics.add.overlap(heroes.heroes, e.detectionbox, disparoEnemigo, null, scene);
}

function disparoEnemigo(en,py)
{
	if(en.tiempoDisparo <= 0)
	{
		en.tiempoDisparo = 15;

		var d = grupoDispEnemigo.create(en.x - 15, en.y + 5, 'polvoHielo').setDepth(5).setPipeline('Light2D');

	 	d.setAlpha(0.3);

	 	var separar = Phaser.Math.Between(-50, 50)

	 	scene.physics.moveTo(d, heroes.cabeza.x + separar, heroes.cabeza.y + separar, 50);

		d.tiempoVida = 320;
	}

	en.tiempoDisparo--;
}

export function updateDispEnem()
{
	Phaser.Actions.Call(grupoDispEnemigo.getChildren(),function(d)
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

		if (obj.dano != null){
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
        
        if(e.vida <= 0)
        {
			e.detectionbox.destroy()
            e.destroy()
        }
	}

}
