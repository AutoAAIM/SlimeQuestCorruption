import  * as yasha from './yasha.js';
import  * as jotun from './jotun.js';
import  * as mago from './magoNPC.js';
import  * as oscuridad from './mapa.js';
import  * as portal from './tp.js';
import  * as bossHielo from './bossHielo.js';

var config = {
	type: Phaser.AUTO,
	width:600,
	height:400,
	pixelArt:true,
	physics:{
		default:'arcade',
		arcade:{
			debug:false,
			gravity:{y:0}
		}
	},
	scene:{
		preload:preload,
		create:create,
		update:update
	},
	scale:{
		zoom:2
	}
}

var game = new Phaser.Game(config);
var scene;
var contFuego;
var contHielo;
var tierra;
var lago;
var fondo;
var muros;
var luz;
var objetos;
var objetos2;
var playerVelocidad;
var player;
var grupoFuego;
var grupoHielo;
var freezeTiles;
var allTiles;
var darkTiles;
var snowTiles;
var allTilesets;
var allPipelines
var tileFuego;
var tilePortal;
var antorchas;
var camara;
var gates;
var puntero;
var pointer;
var light;
var KeyW;
var KeyA;
var KeyS;
var KeyD;
var Hielo;
var i;
var f;

export function preload()
{
	//this.load.atlas('atlas', 'assets/atlas/atlas.png', 'assets/atlas/sprites.json');
	this.load.image('cuevaTiles', 'assets/mapas/terrain.png');
	this.load.image('snowTiles', 'assets/mapas/snow.png');
	this.load.tilemapTiledJSON('CuevaMago', 'assets/mapas/mapa_CuevaMago.json');

	yasha.preload.call(this)
	jotun.preload.call(this)
	mago.preload.call(this)
	portal.preload.call(this)
	bossHielo.preload.call(this)
}

function create()
{
	scene = this;

	const mapa = this.make.tilemap({key:'CuevaMago'});

	const tileset = mapa.addTilesetImage('terrain', 'cuevaTiles');
	const tileset2 = mapa.addTilesetImage('snow', 'snowTiles');

	allTilesets = [tileset, tileset2]

	lago = mapa.createLayer('lago', allTilesets).setDepth(2).setPipeline('Light2D');
	fondo = mapa.createLayer('fondo', allTilesets).setPipeline('Light2D');
	tierra = mapa.createLayer('tierra', allTilesets).setPipeline('Light2D');
	luz = mapa.createLayer('luz', allTilesets).setPipeline('Light2D');
	muros = mapa.createLayer('muros', allTilesets).setDepth(0).setPipeline('Light2D');
	objetos = mapa.createLayer('objetos', allTilesets).setDepth(4).setPipeline('Light2D');
	objetos2 = mapa.createLayer('objetos2', allTilesets).setDepth(1).setPipeline('Light2D');

	mapa.x = 0;
	mapa.y = 0;

	allTiles = [objetos, muros, fondo, objetos2, lago, luz, tierra];

	tileFuego = mapa.createFromObjects('fuegoTiles');
	antorchas = new Array();
	tileFuego.forEach(obj => {
		this.physics.world.enable(obj);
		obj.setAlpha(0);
		obj.encendido = false;

		antorchas.unshift(obj);
	});

	tilePortal = mapa.createFromObjects('tpTiles');
	gates = portal.create(tilePortal);

	jotun.create();

	yasha.create(allTiles, antorchas, config);
	jotun.create();
	oscuridad.create(scene, allTiles);

	tilePortal.forEach(obj => {

		if(obj.name == 'mago')
		{
			obj.setAlpha(0)
			mago.create(obj);
		}

		if(obj.name == 'jotun')
		{
			obj.setAlpha(0)
			jotun.generarEnemigo(obj);
		}

		if(obj.name == 'boss')
		{
			obj.setAlpha(0)
			bossHielo.create(obj);
		}
	});

	freezeTiles = lago.filterTiles(tile => tile.properties.ice).map(x => x.index);
	darkTiles = luz.filterTiles(tile => tile.properties.dark).map(x => x.index);
	snowTiles = objetos.filterTiles(tile => tile.properties.snow).map(x => x.index);

	yasha.setFreeze(lago, freezeTiles);
	var cosas = yasha.grupoHielo

 	lago.setTileIndexCallback(freezeTiles, yasha.freeze, this.physics.add.overlap(yasha.grupoHielo, lago));
	 
	lago.setTileIndexCallback(freezeTiles, yasha.freeze, this.physics.add.overlap(yasha.grupoFuego, lago));

	luz.setTileIndexCallback(darkTiles, oscuridad.encenderOscuridad, this.physics.add.overlap(yasha, luz));

	objetos.setTileIndexCallback(snowTiles, yasha.derretir, this.physics.add.overlap(yasha.grupoFuego, objetos));
	

	this.physics.add.collider(mago.mago, yasha.player);
	this.physics.add.collider(jotun.grupoEnemigos, yasha.player);
	this.physics.add.collider(bossHielo.boss, yasha.player);
 
	objetos.setCollisionByProperty({collides: true});
	muros.setCollisionByProperty({collides: true});
	objetos2.setCollisionByProperty({collides: true});

	portal.collisionPortal(yasha.player);

	this.physics.add.overlap(yasha.player, mago.mago.detectionbox, yasha.encenderHielito, null, this);

	this.physics.add.overlap(yasha.player, jotun.grupoDispEnemigo, jotun.quitarVida, null, this);
}

function update()
{
	yasha.update();
	portal.update();
	oscuridad.darkMode();
	mago.magoTrue(antorchas);
	jotun.updateDispEnem();
	bossHielo.updateNieblaBoss();
}