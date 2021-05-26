import * as keys from '../keys.js';

var scene;
export var player
var contFuego;
var contHielo;
var playerVelocidad;
var grupoFuego;
var grupoHielo;
var camara;
var puntero;
var pointer;
var config;
var move;
var armasHeroicas
var allLayers;

export function preload()
{
	this.load.image('Yasha', 'assets/sprites/yasha.png');
	this.load.image('YashaBack', 'assets/sprites/yashaBack.png');
	this.load.image('disparoHielo', 'assets/sprites/hielo.png');
	this.load.image('textoHielo', 'assets/sprites/hieloTexto.png');
	this.load.image('cursor','assets/sprites/cursor.png');
	this.load.spritesheet('fuego', 'assets/sprites/fuego.png', {frameWidth:32, frameHeight:32});
	this.load.spritesheet('fuego', 'assets/sprites/fuego.png', {frameWidth:32, frameHeight:32});

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

	player = grupo.create(spawn.x,spawn.y, 'Yasha').setDepth(5);
	player.name = "yasha"
	player.heroe = true;
	player.setCircle(16, 0);
	player.inmovil = false;
	player.maxVida = 8;
  	player.vida = player.maxVida;
	player.setOrigin(0.5);

	grupoFuego = scene.physics.add.group();

	grupoHielo = scene.physics.add.group().setDepth(20);

	player.muerto = false;

	scene.anims.create({
		key:'hot',
		frames: scene.anims.generateFrameNames('fuego', {start:0, end:3}),
		frameRate: 10,
		repeat: -1
	});

	if(antorchas != null)
	{
		scene.physics.add.overlap(grupoFuego, antorchas, burn, null, scene);
	}

	scene.physics.add.collider(player, allTiles);

	scene.cameras.main.startFollow(player);

	camara = scene.cameras.main;

	puntero = new Phaser.Geom.Point();

	pointer = scene.input.activePointer;

	//player.setPipeline('Light2D');
}

export function update(cabeza)
{
	if (player == cabeza) { player.enCabeza = true }
	else { player.enCabeza = false }

	if (!player.muerto && player.enCabeza && !player.inmovil)
    {
        input();
    }
    
    updateHielo();
	contHielo--;

	updateFuego();
	contFuego--;

	puntero.x = player.x - config.width / 2 + pointer.x;
	puntero.y = player.y - config.height / 2 + pointer.y;
}

function input()
{
	if(keys.Up.isDown)
	{
		player.vectorY=-1;
		player.look = "up"
	}

	else if(keys.Down.isDown)
	{
		player.vectorY=1;
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

	if (keys.Hability.isDown && contHielo <= 0)
	{
		generarHielo();
	}

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

function generarFuego()
{
	var f = grupoFuego.create(puntero.x, puntero.y, 'fuego').setDepth(20);
	f.play('hot');
	f.scale = 1;
	contFuego = 30;
	f.light = scene.lights.addLight(f.x, f.y, 100).setColor(0xffffff).setIntensity(1);

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

		scene.physics.add.collider(h, allLayers);
		//console.log(h)
		

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

export function derretir(fuego, nieve)
{
	if (nieve.properties != undefined && nieve.properties.snow == true && fuego.fuego)
    {
        nieve.setAlpha(0);

		utilidades.collisionSwitch(nieve, false);

        nieve.properties.snow = false;
    }
}

export function freeze(objeto, lago)
{
    if (lago.properties != undefined && !lago.properties.freeze && objeto.hielo )
    {
        lago.setAlpha(0);

        lago.properties.freeze = true;
    }

    if(lago.properties != undefined && lago.properties.freeze && objeto.fuego)
    {
		lago.setAlpha(1);

        lago.properties.freeze = false;
    }    
}

export function setFreeze(layer, id)
{
	layer.setTileIndexCallback(id, freeze, scene.physics.add.overlap(grupoHielo, layer));
}

function updateTexto()
{
	if(cuadroTexto != undefined)
	{
		cuadroTexto.x = player.x - config.width / 2 + config.width / 2;
		cuadroTexto.y = player.y - config.height / 2 + config.height - 50;

		cuadroTexto2.x = player.x - config.width / 2 + config.width / 2;
		cuadroTexto2.y = player.y - config.height / 2 + config.height - 50;

		scene.magoText.x = player.x - config.width / 2 + 16;
		scene.magoText.y = player.y - config.height / 2 + 310;

		imagenTexto.x = player.x - config.width / 2 + 540;
		imagenTexto.y = player.y - config.height / 2 + 350;

		if(Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), mago.mago.detectionbox.getBounds()))
		{
			cuadroTexto.setAlpha(1)
			cuadroTexto2.setAlpha(1)
			scene.magoText.setAlpha(1)
			imagenTexto.setAlpha(1)
		}
		else{
			cuadroTexto.setAlpha(0)
			cuadroTexto2.setAlpha(0)
			scene.magoText.setAlpha(0)
			imagenTexto.setAlpha(0)
		}

	}
}

export function encenderHielito(yasha, obj)
{
	player.hieloTrue = true;

	if(textoMago == false)
	{
		cuadroTexto = scene.add.rectangle(player.x - config.width / 2 + config.width / 2, player.y - config.height / 2 + config.height - 50, config.width, 100, 0xaaaaaa).setDepth(16);


		cuadroTexto2 = scene.add.rectangle(player.x - config.width / 2 + config.width/2, player.y - config.height / 2 + config.height - 50, config.width-8, 100 - 8, 0x000000).setDepth(17);

		scene.magoText = scene.add.text(player.x - config.width / 2 + 16, player.y - config.height / 2 + 310, 'Mago: \nOtro novato en busca de poder... \nToma esto y dejame en paz.', {fontSize: '12px', fill: '#FFFFFF', fontFamily: 'sans-serif'}).setDepth(18);

		imagenTexto = scene.physics.add.sprite(player.x - config.width / 2 + 540, player.y - config.height / 2 + 330, 'textoHielo').setDepth(18).setScale(2);
	}

	textoMago = true;
}