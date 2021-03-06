
var scene;
var pointer;
var cursor;
export var player;
var keyUp;
var keyRight;
var keyLeft;
var keyDown;
var fire;
export var keyP;
var puntero;
var config;
var velocity;
var ondaVelocity;
var tiempo;
var tiempo2;
var tiempoEstado;
export var beamList;
export var ondaList;
var ondaDeDanyo;
var ondaCura;
var vidaText;
var armasHeroicas;
var layers;

import * as keys from '../keys.js';
import * as utilidades from '../utilidades.js';
import * as grupoHeroes from '../grupoHeroes.js';

export function preload() {
  this.load.image('missile1', 'assets/images/missile1.png');
  this.load.spritesheet('glish', 'assets/images/Glishsheet.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('ondas', 'assets/images/ondas.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('cura', 'assets/images/AitorMolestaParte1.png', { frameWidth: 32, frameHeight: 32 });
  scene = this;
}

export function create(spawn, allLayers, conf, grupo, arHe) {

	armasHeroicas = arHe;
    createCursor();

    player = grupo.create(spawn.x,spawn.y, 'glish').setOrigin(0.5).setDepth(5);
    player.name = "glish";
    player.heroe = true;
    player.status = "none";
    player.maxVida = 14;
    player.setCircle(16, 0);
    player.vida = player.maxVida;
    player.tiempoStatus = 0;
    player.inmune = false;
    player.inmuneT = 0;
	player.inmovil = false;
	player.muerto = false;
    player.ralentizar = 0;

    scene.anims.create({
		key:'GlishF',
		frames: scene.anims.generateFrameNames('glish', { start: 0, end: 1 }),
		frameRate: 3,
		repeat: -1
	});

    scene.physics.add.collider(player, allLayers);

    scene.cameras.main.startFollow(player);
    beamList = scene.physics.add.group();
    ondaList = scene.physics.add.group();

    velocity = 150;
    ondaVelocity = 400;
    tiempo = 0;
    tiempo2 = 0;
    tiempoEstado = 0;

    config = conf;
    layers = allLayers;

    player.play('GlishF', true);
    
}

export function update(cabeza) {
    
    player.play('GlishF', true);
 
	if(player == cabeza){ player.enCabeza = true}
	else{player.enCabeza = false}
	
    if(!player.muerto && !player.inmovil && player.enCabeza == true)
	{

		moverPersonaje.call(scene);
		updateCursor();
  	    if (pointer.isDown && tiempo == 0) {
		  ondasRockeras.call(scene);
		}
		if (keys.Hability.isDown && tiempo2 == 0 && scene.game.glishActivarCuracion == true) {
		  heavyMetal.call(scene);
		}
		updateEstadosDelJugador.call(scene);
		cursor.setAlpha(1)
	}
	else{
        cursor.setAlpha(0);
    }
    //player.play('GlishF', true);
	atacarPersonaje.call(scene);
}

function createCursor() {
  pointer = scene.input.activePointer;
  //Cursor
  cursor = scene.physics.add.sprite(0, 0, 'missile1').setDepth(20);
  puntero = new Phaser.Geom.Point();
}

function updateCursor() {
  puntero.x = player.x - config.width / 2 + pointer.x;
  puntero.y = player.y - config.height / 2 + pointer.y;
  cursor.x = puntero.x;
  cursor.y = puntero.y;

}

function moverPersonaje() {
  	player.move = false;
  if (player.body != undefined && player.enCabeza) {
    if(keys.Up.isDown){
      player.move = true;
      player.movingY = -1//(-velocity + relentizar);
	  player.look = "up"

    }else if(keys.Down.isDown){
      player.move = true;
      player.movingY = 1;
	  player.look = "down"

    }else {player.movingY = 0; }

    if(keys.Right.isDown){
      player.move = true;
      player.movingX = 1;
	  player.look = "right"

    } else if(keys.Left.isDown){
      player.move = true;
      player.movingX = -1;
	  player.look = "left"

    } else {player.movingX = 0; }

		player.dir = new Phaser.Math.Vector2( player.movingX, player.movingY);
		player.dir.normalize();
		player.setVelocityX((velocity-player.ralentizar)*player.dir.x);
		player.setVelocityY((velocity-player.ralentizar)*player.dir.y);
		if(player.dir.x != 0 || player.dir.y != 0) {player.move = true;}
		else{player.move = false;}

  }

}

function ondasRockeras() {
  
  ondaDeDanyo = beamList.create(player.x, player.y, 'ondas');
  ondaDeDanyo.stunt= 60;
  ondaDeDanyo.stuntProb = 40;
  ondaDeDanyo.dano = 2;
  tiempo = 60;
  ondaDeDanyo.scale = 0.4;
  ondaDeDanyo.limite = 2;
  ondaDeDanyo.angle = Math.atan2(puntero.y - player.y, puntero.x - player.x);
  ondaDeDanyo.angle = ondaDeDanyo.angle * 180 / Math.PI;
  Phaser.Actions.Call(beamList.getChildren(), function (go) {
    go.dir = new Phaser.Math.Vector2(Math.cos(go.angle * Math.PI / 180), Math.sin(go.angle * Math.PI / 180));
    go.dir.normalize();
  });

  scene.physics.add.collider(beamList, layers);
  
  armasHeroicas.unshift(ondaDeDanyo);

}

function heavyMetal() {

  ondaCura = ondaList.create(player.x, player.y, 'cura');
  ondaCura.tipo = "ondaCura";
  Phaser.Actions.Call(grupoHeroes.heroes.getChildren(), function(algo) {
    if (algo.vida < algo.maxVida && algo.vida > 0) {
      algo.vida += 2;
      player.ralentizar = 0;
    }
    if(algo.vida > algo.maxVida){
      algo.vida = algo.maxVida;
    }

  } );

  ondaCura.scale = 0.4;
  ondaCura.limite = 5;

  Phaser.Actions.Call(ondaList.getChildren(), function (go) {
    go.setSize(go.width, go.height);
    go.dir = new Phaser.Math.Vector2(0, 0);
    go.dir.normalize();
  });
  tiempo2 = 400;
}

function atacarPersonaje() {

  if (tiempo > 0) {
    tiempo--;
  }
  if (tiempo2 > 0) {
    tiempo2--;
  }

  //Indica el movimiento tanto del disparo recto como el direccionado
  Phaser.Actions.Call(beamList.getChildren(), function (go) {

    go.setVelocityX(ondaVelocity * go.dir.x);
    go.setVelocityY(ondaVelocity * go.dir.y);

    if (go.scale <= go.limite) {
      go.scale += 0.03;
    }
    if (go.scale != null) {
      go.setScale(go.scale);
    }
    if (go.scale >= go.limite) {
      go.destroy();
    }

    if(go.body != undefined && !go.body.blocked.none)
    {
      go.destroy();
    }
    
  });

  Phaser.Actions.Call(ondaList.getChildren(), function (go) {
    go.x = player.x;
    go.y = player.y;
    Phaser.Actions.Call(grupoHeroes.heroes.getChildren(), function(algo) {
        algo.status = "none";
    });
    if (go.scale <= go.limite) {
        go.scale += 0.07;
    }
    if (go.scale != null) {
        go.setScale(go.scale);
    }
    if (go.scale >= go.limite) {
        go.destroy();
    }
  });

}

function updateEstadosDelJugador() {
    if (player.status != "none") {
        if (player.status == "envenenado") {
        if (player.tiempoStatus % 60 == 0) {
            player.vida -= 1;
        }
        if (player.tiempoStatus <= 0) {
            player.status = "none";
            player.ralentizar = 0;
        } else {
            player.tiempoStatus--;
        }
        }
    }else if(player.status == "none"){
        player.ralentizar = 0;
    }

	player.inmuneT--;
	if(player.inmuneT <= 0)
	{
		player.inmune = false;
	}

}

export function climbing_plant(obj, casilla) {

  if (obj == ondaDeDanyo && casilla.properties.cut_attack) {
    obj.destroy();
    utilidades.collisionSwitch(casilla, false);
    casilla.properties.cut_attack = false;
    casilla.setAlpha(0);

  }
}

export function recibirDanyo(obj1, obj2){
    var aleatorio2;
    //console.log("Ataque "+obj2.ataque+" vida "+obj1.vida);
    if(obj1.inmuneT <= 0){

      obj1.setAlpha(0);
      scene.tweens.add({
          targets: obj1,
          alpha: 1,
          duration: 200,
          ease: 'Linear',
          repeat: 5,
      });
      
      obj1.vida--;
      
      obj1.inmuneT = 130;
    }
}
