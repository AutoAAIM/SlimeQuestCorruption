import * as keys from '../keys.js';
import * as utilidades from '../utilidades.js';

var scene;
export var player
var contFuego;
var contHielo;
var playerVelocidad;
export var grupoFuego;
export var grupoHielo;
var camara;
var puntero;
var pointer;
var config;
var move;
var cursor;
var armasHeroicas
var allLayers;

export function preload()
{
	this.load.image('disparoHielo', 'assets/images/hielo.png');
	this.load.image('varita','assets/images/varita.png');
	this.load.spritesheet('fuego', 'assets/images/fuego.png', {frameWidth:32, frameHeight:32});
	this.load.spritesheet('YashaBackF', 'assets/images/yashaBackFuego.png', {frameWidth:32, frameHeight:32});
	this.load.spritesheet('YashaBackFH', 'assets/images/yashaBackFuegoHielo.png', {frameWidth:32, frameHeight:32});
	this.load.spritesheet('YashaF', 'assets/images/yashaFuego.png', {frameWidth:32, frameHeight:32});
	this.load.spritesheet('YashaBackFH', 'assets/images/yashaFuegoHielo.png', {frameWidth:32, frameHeight:32});

	scene = this;
}

export function create(spawn, allTiles, antorchas, conf, grupo, arHe)
{
	armasHeroicas = arHe
	allLayers = allTiles

	config = conf;
	contFuego = 3;
	contHielo = 3;

	playerVelocidad = 150;

	player = grupo.create(spawn.x,spawn.y, 'YashaF').setDepth(5);
	player.name = "yasha";
	player.heroe = true;
	player.setCircle(16, 0);
	player.inmovil = false;
	player.maxVida = 12;
  	player.vida = player.maxVida;
	player.setOrigin(0.5);
	player.hieloTrue = false;

	grupoFuego = scene.physics.add.group();

	grupoHielo = scene.physics.add.group().setDepth(20);

	player.muerto = false;

	scene.anims.create({
		key:'hot',
		frames: scene.anims.generateFrameNames('fuego'),
		frameRate: 10,
		repeat: -1
	});

	scene.anims.create({
		key:'backF',
		frames: scene.anims.generateFrameNames('YashaBackF'),
		frameRate: 3,
		repeat: -1
	});

	scene.anims.create({
		key:'backFH',
		frames: scene.anims.generateFrameNames('YashaBackFH'),
		frameRate: 3,
		repeat: -1
	});

	scene.anims.create({
		key:'yashaF',
		frames: scene.anims.generateFrameNames('YashaF'),
		frameRate: 3,
		repeat: -1
	});

	scene.anims.create({
		key:'yashaFH',
		frames: scene.anims.generateFrameNames('YashaFH'),
		frameRate: 3,
		repeat: -1
	});

	if(antorchas != null)
	{
		scene.physics.add.overlap(grupoFuego, antorchas, burn, null, scene);
	}

	scene.physics.add.collider(player, allTiles);

	player.luz = scene.lights.addLight(player.x, player.y, 0);

	scene.cameras.main.startFollow(player);

	camara = scene.cameras.main;

	puntero = new Phaser.Geom.Point();

	pointer = scene.input.activePointer;

	cursor = scene.add.sprite(0,0,'varita').setDepth(20);
	cursor.setOrigin(0.5)

	cursor.pointer = pointer;
}

export function update(cabeza)
{
	if (player == cabeza) { player.enCabeza = true }
	else { player.enCabeza = false }

	if (!player.muerto && player.enCabeza && !player.inmovil)
    {
        input();
		cursor.setAlpha(1)
    }
	else
	{
		player.look = cabeza.look;
		playerAnims();
		cursor.setAlpha(0);
	}

	updateFuego();
	updateHielo();
	contFuego--;

	puntero.x = player.x - config.width / 2 + keys.pointer.x;
	puntero.y = player.y - config.height / 2 + keys.pointer.y;

	player.luz.x = player.x
	player.luz.y = player.y

	updatePuntero();
}

export function updatePuntero()
{
	cursor.x = player.x - config.width / 2 + keys.pointer.x - 14;
	cursor.y = player.y - config.height / 2 + keys.pointer.y + 15;
}

function input()
{
	if(keys.Up.isDown)
	{
		player.vectorY = -1;
		player.look = "up"
	}

	else if(keys.Down.isDown)
	{
		player.vectorY = 1;
		player.look = "down"
	}

	else
	{
		player.vectorY=0;
	}

	if(keys.Left.isDown)
	{
		player.vectorX=-1;
		player.look = "left"
	}

	else if(keys.Right.isDown)
	{
		player.vectorX=1;
		player.look = "right"
	}

	else
	{
		player.vectorX=0;
	}

	if (keys.pointer.isDown && contFuego <= 0)
	{
		generarFuego();
	}

	if (keys.Hability.isDown && contHielo <= 0 && scene.game.yashaActivarCuracion == true)
	{
		generarHielo();
	}
	contHielo--;

	playerAnims();

	player.dir = new Phaser.Math.Vector2( player.vectorX, player.vectorY);
	player.dir.normalize();
	player.setVelocityX(playerVelocidad*player.dir.x);
	player.setVelocityY(playerVelocidad*player.dir.y)

	if(player.dir.x != 0 || player.dir.y != 0)
	{
		player.move = true
	}
	else
	{
		player.move = false
	}

	player.inmuneT--;

	if (player.inmuneT <= 0) {
		player.inmune = false;
	}
}

export function playerAnims()
{
	if(player.look == 'up')
	{
		player.play('backF', true);
	}

	else if(player.look == 'down' || player.look == 'left' || player.look == 'right')
	{
		player.play('yashaF', true);
	}
}

function generarFuego()
{
	var f = grupoFuego.create(puntero.x, puntero.y, 'fuego').setDepth(20);
	f.play('hot');
    f.dano = 1;
	f.scale = 1;
	contFuego = 30;
	f.light = scene.lights.addLight(f.x, f.y, 100).setColor(0xffffff).setIntensity(1);
	f.fuego = true;

	armasHeroicas.unshift(f)
}

function updateFuego()
{
	Phaser.Actions.Call(grupoFuego.getChildren(), function(obj)
	{
		obj.scale -= 0.009;
		obj.setScale(obj.scale);

		if(obj.scale <= 0)
		{
			scene.lights.removeLight(obj.light);
			obj.destroy();
		}

		obj.light._radius--;
	});
}

export function burn(objeto, fuego)
{
	if(!objeto.encendido)
	{
		var f = scene.add.sprite(objeto.x, objeto.y, 'fuego').setDepth(20);
		f.play('hot');

		f.light = scene.lights.addLight(objeto.x, objeto.y, 800).setColor(0xffffff).setIntensity(2);

		objeto.encendido = true;
	}
}

function generarHielo()
{
	var h = grupoHielo.create (player.x, player.y, 'disparoHielo').setDepth(20);
		h.angle = Math.atan2(puntero.y - h.y, puntero.x - h.x) * 180 / Math.PI;
		h.angle += 45;
		h.fragil = true;
		h.tiempo = 0;
		h.setCircle(2, 14, 14);
        h.dano = 1;
		h.hielo = true;
		scene.physics.add.collider(h, allLayers);

		contHielo = 30;

		scene.physics.moveToObject(h, puntero, 240);

	armasHeroicas.unshift(h)
}

function updateHielo()
{
	for(var i = 0; i < grupoHielo.getChildren().length; i++)
    {
    	var h = grupoHielo.getChildren()[i];
		h.tiempo++;

		if (h.tiempo > 60)
		{
			h.destroy();
		}
    }
}

export function derretir(fuego, obj)
{
	if (obj.properties != undefined && obj.properties.snow == true && fuego.fuego == true)
    {
        obj.setAlpha(0);

		utilidades.collisionSwitch(obj, false);

        obj.properties.snow = false;
    }
}

export function freeze(objeto, lago)
{
	console.log(lago)
	console.log(objeto)
    if (lago.properties != undefined && lago.properties.ice && objeto.hielo == true)
    {
        lago.setAlpha(0);

        lago.properties.ice = false;
    }

    if(lago.properties != undefined && !lago.properties.ice && objeto.fuego == true)
    {
		lago.setAlpha(1);

        lago.properties.ice = true;
    }    
}

export function setFreeze(layer, id)
{
	layer.setTileIndexCallback(id, freeze, scene.physics.add.overlap(layer, grupoHielo));
}
