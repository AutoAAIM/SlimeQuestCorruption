import * as utilidades from '../utilidades.js';
import * as heroes from '../grupoHeroes.js';

var config;
var s
export var enemigoBoss;
var scene;
var tentaculos;
export var tentacleList;

export var tentacleSegmentsGroup = new Array

export function preload(){
  this.load.spritesheet('BossSwamp','assets/images/bossPoison.png', { frameWidth: 86, frameHeight: 86});
  this.load.spritesheet('tentacle','assets/images/tentacles.png', { frameWidth: 32, frameHeight: 32 });
  scene = this;
}

export function createBoss(obj, conf, el){
    tentacleList = scene.physics.add.group();
    config = conf;
    enemigoBoss = scene.physics.add.sprite(obj.x,obj.y, 'BossSwamp').setOrigin(0.5); 
    enemigoBoss.vida = 2;
    enemigoBoss.dano = 1;
    enemigoBoss.inmune = -1;
    enemigoBoss.temporizador = 0;
    enemigoBoss.status = "none";
    enemigoBoss.muerto = false;
    enemigoBoss.teleportar = true;
    enemigoBoss.tiempo = 0;
    enemigoBoss.trigger = scene.add.rectangle(enemigoBoss.x-5,enemigoBoss.y+150, 600, 500);
    scene.physics.add.existing(enemigoBoss.trigger, false);
    enemigoBoss.trigger.activado = false;

}

export function generateTentacles(obj){

  utilidades.convertToProperties(obj)
  s =  tentacleList.create(obj.x,obj.y, 'tentacle'/*, 3*/);
	s.inmovil = false;
	s.dano = 1;

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

	//scene.physics.add.overlap(s.detectionbox, heroes.cabeza, detectarJugador);

}

function createSegmentos(parent)
{

	parent.segmentos = scene.physics.add.group();
	for(var i = 1; i < parent.maxLong; i++)
	{
		if(i < parent.maxLong/2)
		{
			var parte = parent.segmentos.create(parent.x,parent.y-i*4, 'tentacle'/*, 2*/).setDepth(4);
		}
		else
		{
			var parte = parent.segmentos.create(parent.x,parent.y-i*4, 'tentacle'/*, 1*/).setDepth(4);
		}

		parte.xini = parte.x
		parte.yini = parte.y
    parte.dano = 1;
		parte.dano=1;

		tentacleSegmentsGroup.unshift(parte)

	}

	var cabeza = parent.segmentos.create(parent.x,parent.y-parent.maxLong*4, 'tentacle'/*, 0*/).setDepth(4);
  	cabeza.dano = 1;
	cabeza.xini = cabeza.x
	cabeza.yini = cabeza.y
	//l.segmentos.unshift(cabeza);
}

function calcularSegmento(parent)
{

	var punta = parent.segmentos.getChildren()[parent.segmentos.getLength()-1]
	var dir = new Phaser.Math.Vector2( Math.cos(punta.angle*Math.PI/180), Math.sin(punta.angle*Math.PI/180));
	scene.tweens.addCounter({
			from: 0,
			to: parent.segmentos.getLength(),
			duration: 1000,
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
							parent.x + 32*((value-temp)*dir.x),
							parent.y + ((32*((value-temp)*dir.y))),
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

export function activarTrigger(){
  enemigoBoss.trigger.activado = true;
  if(enemigoBoss.teleportar){
    heroes.heroes.x = enemigoBoss.x;
    heroes.heroes.y = enemigoBoss.y+250;
    enemigoBoss.teleportar = false;
    enemigoBoss.block = scene.add.rectangle(enemigoBoss.x-5,enemigoBoss.y+420, 600, 100);
    scene.physics.add.existing(enemigoBoss.block, true);
    enemigoBoss.block.body.enable = true;
  }



  //scene.physics.add.collider(heroes.cabeza, enemigoBoss.block);


}


export function updateBoss(){

  if(enemigoBoss.trigger.activado){
    if(enemigoBoss.inmune >= 0){
      enemigoBoss.inmune--;
    }

    Phaser.Actions.Call(tentacleList.getChildren(), function(s){

    var punta = s.segmentos.getChildren()[s.segmentos.getLength()-1]
		punta.angle = Math.atan2(heroes.cabeza.y - s.y, heroes.cabeza.x - s.x)* 180/Math.PI;
		if(punta.angle > 90 || punta.angle < -90)
		{
			punta.flipY = true;
		}
		else
		{
			punta.flipY = false;
		}

		if(s.time <= 0 && !s.animado)
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

		s.detectionbox.y = s.y;
		s.detectionbox.x = s.x;


    });
  }

  if(enemigoBoss.vida <= 0){
    Phaser.Actions.Call(tentacleList.getChildren(), function(pata){

      Phaser.Actions.Call(pata.segmentos.getChildren(), function(go){
        go.destroy();
       
      })

    pata.setAlpha(0)
    
    });

    enemigoBoss.block.destroy();

  }
}