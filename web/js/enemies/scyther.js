import * as utilidades from '../utilidades.js';
import * as boxTank from '../personajes/boxTank.js';
import * as heroes from '../grupoHeroes.js';
import * as dinero from '../dinero.js';
import * as inventario from '../inventario.js'

export var scytherSegmentsGroup = new Array

var scene

export function preload()
{
	this.load.spritesheet('scyther','assets/images/Scyther.png', { frameWidth: 32, frameHeight: 16});
	scene = this;
}

export var scytherGroup;

export function create(allLayers)
{
	scytherGroup = scene.physics.add.group();
	//scene.physics.add.collider(scytherGroup, scytherGroup);
}

export function createScyther(obj, gren)
{
	utilidades.convertToProperties(obj)
	var s = scytherGroup.create(obj.x, obj.y, 'scyther', 3)
	s.inmovil = false;
	s.dano = 1;
	s.escondido = true;
	//s.setTexture('shapeshifter');
	//s.y -= 16;

	s.animado=false;

	s.setDepth(4);
	s.vida = 8;
	if(obj.properties.maxLong != undefined && obj.properties.maxLong > 0)
	{
		s.maxLong = obj.properties.maxLong;
	}
	else
	{
		s.maxLong = 10;
	}
	

	s.detectionbox = scene.add.rectangle(s.x, s.y, 200, 200);
	scene.physics.add.existing(s.detectionbox, false);

	s.detectionbox.detectado = false;
	s.time = 0
	s.cooldown = 120;
	//s.enable = false

	createSegmentos(s)

	scene.physics.add.overlap(heroes.heroes, s.detectionbox, detectarJugador, null, scene);

	gren.unshift(s);

	//s.setSize(20, 16)
	//s.setOffset(6, 14)
	//scene.physics.add.collider(s, scytherGroup);
}

function createSegmentos(parent)
{
	parent.segmentos = scene.physics.add.group();;
	for(var i = 1; i < parent.maxLong; i++)
	{
		if(i < parent.maxLong/2)
		{
			var parte = parent.segmentos.create(parent.x,parent.y-i*4, 'scyther', 2).setDepth(4);
		}
		else
		{
			var parte = parent.segmentos.create(parent.x,parent.y-i*4, 'scyther', 1).setDepth(4);
		}

		parte.xini = parte.x
		parte.yini = parte.y
    	parte.ataque = 1;
		parte.dano=1;

		scytherSegmentsGroup.unshift(parte)

		//console.log(scytherSegmentsGroup)
	}

	var cabeza = parent.segmentos.create(parent.x,parent.y-parent.maxLong*4, 'scyther', 0).setDepth(4);
  	cabeza.ataque = 1;
	cabeza.xini = cabeza.x
	cabeza.yini = cabeza.y
	//l.segmentos.unshift(cabeza);
}

function calcularSegmento(parent)
{
	var guadana = parent.segmentos.getChildren()[parent.segmentos.getLength()-1]
	var dir = new Phaser.Math.Vector2( Math.cos(guadana.angle*Math.PI/180), Math.sin(guadana.angle*Math.PI/180));
	scene.tweens.addCounter({
			from: 0,
			to: parent.segmentos.getLength(),
			duration: 500,
      		//yoyo: true,
			onUpdate: function (tween)
			{
				var value = tween.getValue()

				for(var i=0; i<parent.segmentos.getLength(); i++)
				{
					var temp = parent.segmentos.getLength()-1-i;
					if(value-temp>0)
					{
						scene.physics.moveTo(parent.segmentos.getChildren()[i],
							parent.x + 8*((value-temp)*dir.x),
							parent.y + ((8*((value-temp)*dir.y))),
							20*i
						);
					}
					else
					{
						scene.physics.moveTo(parent.segmentos.getChildren()[i],
							parent.segmentos.getChildren()[i].xini,
							parent.segmentos.getChildren()[i].yini,
							20*i
						);
					}
					parent.animado=true
				}
			},
			onComplete: function()
			{
				scene.tweens.addCounter({
					from: 0,
					to: parent.segmentos.getLength()*2,
					duration: 750,
					//yoyo: true,
					onUpdate: function (tween)
					{
						var value = tween.getValue()

						for(var i=0; i<parent.segmentos.getLength(); i++)
						{
							var temp = parent.segmentos.getLength()-1-i;
							if(value-temp>0)
							{
								scene.physics.moveTo(parent.segmentos.getChildren()[i],
									parent.segmentos.getChildren()[i].xini,
									parent.segmentos.getChildren()[i].yini,
									20*i
								);
							}
							parent.animado=true
						}
					},
					onComplete: function()
					{
						parent.animado=false
					}
				});
			}
		});

}

export function detectarJugador(db, pj)
{
	db.detectado = true;
}

function salir(parent)
{
	if(parent.escondido)
	{
		var guadana = parent.segmentos.getChildren()[parent.segmentos.getLength()-1]
		var dir = new Phaser.Math.Vector2( Math.cos(guadana.angle*Math.PI/180), Math.sin(guadana.angle*Math.PI/180));
		scene.tweens.addCounter({
				from: 0,
				to: parent.segmentos.getLength(),
				duration: 500,
				//yoyo: true,
				onUpdate: function (tween)
				{
					var value = tween.getValue()

					for(var i=0; i<parent.segmentos.getLength(); i++)
					{
						parent.segmentos.getChildren()[i].setAlpha(1);
						parent.segmentos.getChildren()[i].body.enable = true;

						scene.physics.moveTo(parent.segmentos.getChildren()[i],
							parent.segmentos.getChildren()[i].xini,
							parent.segmentos.getChildren()[i].yini,
							20*i
						);
						parent.animado=true
					}
				},
				onComplete: function()
				{
					//parent.body.enable = true;
					parent.animado=false
				}
			});
	}
}

function esconder(parent)
{
	if(parent.escondido)
	{
		var guadana = parent.segmentos.getChildren()[parent.segmentos.getLength()-1]
		var dir = new Phaser.Math.Vector2( Math.cos(guadana.angle*Math.PI/180), Math.sin(guadana.angle*Math.PI/180));
		scene.tweens.addCounter({
				from: 0,
				to: parent.segmentos.getLength(),
				duration: 500,
				//yoyo: true,
				onUpdate: function (tween)
				{
					var value = tween.getValue()

					for(var i=0; i<parent.segmentos.getLength(); i++)
					{
						scene.physics.moveTo(parent.segmentos.getChildren()[i],
							parent.x,
							parent.y,
							20*i
						);
						parent.animado=true
					}
				},
				onComplete: function()
				{
					for(var i=0; i<parent.segmentos.getLength(); i++)
					{
						parent.segmentos.getChildren()[i].setAlpha(0);
						parent.segmentos.getChildren()[i].body.enable = false;
					}
					parent.animado=false
				}
			});
	}
}

export function update()
{
	
	Phaser.Actions.Call(scytherGroup.getChildren(),function(s)
	{
		if(Phaser.Math.Distance.BetweenPoints(s, heroes.cabeza) <= s.maxLong * 8 && s.vida>0)
		{
			salir(s);
			s.escondido = false;
		}
		else
		{
			esconder(s);
			s.escondido = true;
		}

		var guadana = s.segmentos.getChildren()[s.segmentos.getLength()-1]
		guadana.angle = Math.atan2(heroes.cabeza.y - s.y, heroes.cabeza.x - s.x)* 180/Math.PI;
		if(guadana.angle > 90 || guadana.angle < -90)
		{
			guadana.flipY = true;
		}
		else
		{
			guadana.flipY = false;
		}

		if(s.time <= 0 && s.escondido == false && !s.animado)
		{
			s.time = s.cooldown;
			
			calcularSegmento(s)
		}
		s.time--;

		if(!s.animado)
		{
			for(var i=0; i<s.segmentos.getLength(); i++)
			{
				s.segmentos.getChildren()[i].x = s.segmentos.getChildren()[i].xini
				s.segmentos.getChildren()[i].y = s.segmentos.getChildren()[i].yini
				s.segmentos.getChildren()[i].setVelocityX(0)
				s.segmentos.getChildren()[i].setVelocityY(0)
			}
		}

		if(s.detectionbox.detectado && !s.transformado)
		{
			s.transformado = true;
			console.log('hola')
		}

		if(s.transformado == true && !s.inmovil && s.vida > 0)
		{
			{
				s.move = true;
			}
		}
		else
		{
			s.setVelocityX(0)
			s.setVelocityY(0)
		}

		if(s.vida <= 0 && s.body.enable == true)
		{
			s.detectionbox.destroy();
			s.setTint(0xaaaaaa)
			s.body.enable = false;
			dinero.generarPlort(s, 5);
			inventario.tirarPan(s)//Esto tira el pan
		}


		s.detectionbox.y = s.y;
		s.detectionbox.x = s.x;


	})
}

export function herir(obj, e) {
	console.log(e)
	if (!e.inmune && !e.escondido) {
		//console.log(obj)
		e.detectionbox.detectado = true;
		if (obj.dano != null) {
			e.vida -= obj.dano;
		}else{e.vida --;}
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