
export var enemigoRana;
var lenguaRana;
var scene;
var config;
var tiempoRana = 30;
var ranas = new Array;

import * as enemigos from './enemigos.js';
import * as heroes from '../grupoHeroes.js';

export function preload(){
	this.load.spritesheet('EnemigoRana','assets/images/portalAnim.png', { frameWidth: 32, frameHeight: 32});
  this.load.image('punta_Lengua', 'assets/images/punta_Lengua.png');
  this.load.image('fragmento_Lengua', 'assets/images/fragmento_lengua.png');
	scene = this;

}

export function createEnemyRana(obj, conf, enemyList){
    config = conf;
    enemigoRana = enemyList.create(obj.x,obj.y, 'EnemigoRana').setOrigin(0.5); 
    enemigoRana.name = 'rana';
    enemigoRana.vida = 7;
    enemigoRana.dano = 1;
    enemigoRana.inmune = -1;
    enemigoRana.status = "none";
    enemigoRana.tiempoMoverse = 50;
    enemigoRana.trigger = scene.add.rectangle(enemigoRana.x,enemigoRana.y, config.width/1.5, config.height/1.5);
    scene.physics.add.existing(enemigoRana.trigger, false);
    enemigoRana.trigger.activado = false;
    enemigoRana.triggerAtaque = scene.add.rectangle(enemigoRana.x,enemigoRana.y, config.width/1.75, config.height/1.75);
    scene.physics.add.existing(enemigoRana.triggerAtaque, false);
    enemigoRana.triggerAtaque.activado = false;

	ranas.push(enemigoRana)

	createLenguaRana(enemigoRana)
}

function esRana(enemy)
{

	if(enemy.name == "rana")
	{return true}
	else{return false}
}

function sacaLengua(atributo){

	for(var i = 0; i < ranas.length; i++)
	{
		if(ranas[i].triggerAtaque == atributo)
		{
			return ranas[i];
		}
	}
	return null;
}

function createLenguaRana(parent){

	parent.lengua=new Object;
	var l = parent.lengua;
	l.segmentos=new Array;
	l.maxLong = 16;//cambiando SOLO este numero se ajusta la longitud de la lengua de la rana
	l.cooldown = 60;
	l.time = 0;
}
export function updateLenguaRana(o, atributo){
	var parent = sacaLengua(atributo)
	var l = parent.lengua;
 
	

	if(l.time <= 0)
	{
		l.time = l.cooldown;

		createLenguaSegments(l, parent)
		
		calcularLengua(l, parent)


    scene.physics.add.overlap(heroes.cabeza,l.segmentos, enemigos.recibirDanyo);

	}
	l.time--;
}// Lengua es una struct,contiene .segmentos, una array que contiene varias sprites en la que la 0 es la punta, .maxLong que contiene el numero de segmentos maximos, el tiempo para ser lanzada

function createLenguaSegments(l, parent)
{

	for(var i = 1; i < l.maxLong; i++)
	{
		var parte = scene.physics.add.sprite(parent.x,parent.y, 'fragmento_Lengua')
    	parte.dano = 1;
		parte.angle = Math.atan2(heroes.cabeza.y - parte.y, heroes.cabeza.x - parte.x)* 180/Math.PI;
		l.segmentos.unshift(parte);

	}

	var cabeza = scene.physics.add.sprite(parent.x,parent.y, 'punta_Lengua')
 
	cabeza.angle = Math.atan2(heroes.cabeza.y - cabeza.y , heroes.cabeza.x - cabeza.x)* 180/Math.PI;
  	cabeza.dano = 1;
	l.segmentos.unshift(cabeza);
}

function calcularLengua(l, parent)
{

	var dir = new Phaser.Math.Vector2( Math.cos(l.segmentos[0].angle*Math.PI/180), Math.sin(l.segmentos[0].angle*Math.PI/180));
	scene.tweens.addCounter({
			from: 0,
			to: l.maxLong,
			duration: 250,
      		yoyo:true,
			onUpdate: function (tween)
			{
				var value = tween.getValue()

				for(var i=0; i<l.maxLong; i++)
				{
					if(value-i>0)
					{
						l.segmentos[i].x = parent.x + l.segmentos[0].width*((value-i)*dir.x)
						l.segmentos[i].y = parent.y + l.segmentos[0].height*((value-i)*dir.y)
					}
					else
					{
						l.segmentos[i].x = parent.x
						l.segmentos[i].y = parent.y
					}
				}
			},
			onComplete: function()
			{
				for(var i=0; i<l.maxLong; i++)
				{
					l.segmentos[i].destroy();
				}
			}
		});

}