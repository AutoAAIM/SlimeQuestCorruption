
export var enemigoRana;
export var contadorRana = 2;
export var ranaGrupo;
var lenguaRana;
var scene;
var config;
var tiempoRana = 30;
var ranas = new Array;

import * as mosquitos from './mosquitos.js';
import * as heroes from '../grupoHeroes.js';
import * as dinero from '../dinero.js';

export function preload(){
	this.load.spritesheet('EnemigoRana','assets/images/portalAnim.png', { frameWidth: 32, frameHeight: 32});
    this.load.image('punta_Lengua', 'assets/images/punta_Lengua.png');
    this.load.image('fragmento_Lengua', 'assets/images/fragmento_lengua.png');
	scene = this;

}

export function create(){
    ranaGrupo = scene.physics.add.group();
    scene.physics.add.collider(ranaGrupo, ranaGrupo);
    scene.physics.add.collider(ranaGrupo, mosquitos.mosquitosGrupo);
}

export function createEnemyRana(obj, conf){
    config = conf;
    enemigoRana = ranaGrupo.create(obj.x,obj.y, 'EnemigoRana').setOrigin(0.5); 
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

    scene.physics.add.overlap(heroes.heroes, enemigoRana.trigger, activarTrigger);
    scene.physics.add.overlap(heroes.heroes, enemigoRana.triggerAtaque, updateLenguaRana);        
    scene.physics.add.overlap(heroes.armasHeroicas, enemigoRana, activarTrigger);

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
export function updateLenguaRana(atributo, o){

    if(atributo == enemigoRana.triggerAtaque){
        console.log("tonto")
    }

	var parent = sacaLengua(atributo)
	var l = parent.lengua;
 
	if(l.time <= 0)
	{
		l.time = l.cooldown;

		createLenguaSegments(l, parent)
		
		calcularLengua(l, parent)


    //scene.physics.add.overlap(heroes.cabeza,l.segmentos, recibirDanyo);

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

export function update(){
    Phaser.Actions.Call(ranaGrupo.getChildren(), function(go) {
        
        go.trigger.x = go.x;
        go.trigger.y = go.y;
        if (go.trigger.activado){
            //console.log();
            if(go.name == 'rana'){
                
                go.triggerAtaque.x = go.x;
                go.triggerAtaque.y = go.y;

                if(go.tiempoMoverse == 0 && go.status != "paralizado"){
                    scene.physics.moveTo(go, heroes.cabeza.x, heroes.cabeza.y, 500);
                    go.tiempoMoverse = -1;
                    setTimeout(()=>{
                        go.tiempoMoverse = Phaser.Math.Between(50, 70);
                        if(go.body != undefined){
                            go.setVelocity(0);
                        }
                    },300);
                }
            }

            if(go.status == "paralizado" && go.temporizador !=0){
                go.temporizador--;
                go.setVelocity(0);
            }
            if(go.temporizador == 0){
                go.status = "none";
            }
            if(go.tiempoMoverse != 0){
                go.tiempoMoverse--;

            }
        }
        //go.trigger.activado = false
        if(go.inmune >= 0){
            go.inmune--;
        }
    }); 
}

export function activarTrigger(e, go){

    console.log("1"+go.activado);

    if(go.trigger != undefined && go != heroes.cabeza){
    	go.trigger.activado = true;
        console.log("2"+go.trigger);
    }
    else if(go.triggerAtaque != undefined && go != heroes.cabeza){
        go.triggerAtaque.activado = true;
        console.log("3"+go.triggerAtaque.activado);
    }
	else{
    	go.activado = true;
        console.log("4"+go.activado);
    }

}

export function recibirDanyo(obj1, obj2){
    var aleatorio;
    console.log("Ataque "+obj2.dano+" vida "+obj1.vida);

    if(obj2 !=heroes.cabeza && obj2.inmune <= 0){
        obj2.setAlpha(0);
        scene.tweens.add({
            targets: obj2,
            alpha: 1,
            duration: 200,
            ease: 'Linear',
            repeat: 5,
        });
        obj2.vida -= obj1.dano;
        if(obj1.stunt != undefined){ 
            aleatorio = Math.floor(Math.random() * 100);
            if(aleatorio <= obj1.stuntProb){
                obj2.status = "paralizado";
                obj2.temporizador = 230;
            }
        }
        if(obj2.vida <= 0){
            if(obj2.name == "rana" && contadorRana > 0){
            contadorRana-=1;
            }
            if(obj2.trigger !=null){
                obj2.trigger.activado = false;
                obj2.trigger.destroy();
                if(obj2.triggerAtaque !=null){
                obj2.triggerAtaque.activado = false;
                obj2.triggerAtaque.destroy();
                }
            }
            dinero.generarPlort(obj2, 2);
            obj2.destroy();
        }
        obj2.inmune = 60;
    }
    if(obj1 !=heroes.cabeza && obj1.inmune <= 0){
        obj1.setAlpha(0);
        scene.tweens.add({
            targets: obj1,
            alpha: 1,
            duration: 200,
            ease: 'Linear',
            repeat: 5,
        });
        obj1.vida -= obj2.dano;
        if(obj2.stunt != undefined){ 
            aleatorio = Math.floor(Math.random() * 100);
            if(aleatorio <= obj1.stuntProb){
                obj1.status = "paralizado";
                obj1.temporizador = 230;
            }
        }
        if(obj1.vida <= 0){
            if(obj1.name == "rana" && contadorRana > 0){
            contadorRana-=1;
            }
            if(obj1.trigger !=null){
                obj1.trigger.activado = false;
                obj1.trigger.destroy();
                if(obj1.triggerAtaque !=null){
                obj1.triggerAtaque.activado = false;
                obj1.triggerAtaque.destroy();
                }
            }
            dinero.generarPlort(obj1, 2);
            obj1.destroy();
        }
        obj1.inmune = 60;
    }
}