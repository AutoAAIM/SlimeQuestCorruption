import * as heroes from '../grupoHeroes.js';
import * as yasha from '../personajes/yasha.js';
import * as jotun from '../enemies/jotun.js';
import * as mago from '../NPCs/magoNPC.js';
import * as oscuridad from '../luz.js';
import * as portal from '../portal.js';
import * as bossHielo from '../enemies/bossHielo.js';
import * as inventario from '../inventario.js';
import * as keys from '../keys.js';
import * as dinero from '../dinero.js';
import * as sc from '../sceneConstructor.js';

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
var spawn;

export default class montelago extends Phaser.Scene {
	constructor(){
		super("montelago");
	}

	preload()
	{
		//this.load.atlas('atlas', 'assets/atlas/atlas.png', 'assets/atlas/sprites.json');
		this.load.image('cuevaTiles', 'assets/mapa/terrain4.png');
		this.load.image('snowTiles', 'assets/mapa/snow.png');
		this.load.tilemapTiledJSON('CuevaMago', 'assets/mapa/mapa_CuevaMago.json');

		heroes.preload.call(this)
		jotun.preload.call(this)
		mago.preload.call(this)
		portal.preload.call(this)
		bossHielo.preload.call(this)
		inventario.preload.call(this)
		dinero.preload.call(this)
	}

	create()
	{
		scene = this;

		keys.create(scene);

		const mapa = this.make.tilemap({key:'CuevaMago'});

		const tileset = mapa.addTilesetImage('terrain', 'cuevaTiles');
		const tileset2 = mapa.addTilesetImage('snow', 'snowTiles');

		allTilesets = [tileset, tileset2]

		lago = mapa.createLayer('lago', allTilesets).setDepth(5).setPipeline('Light2D');
		fondo = mapa.createLayer('fondo', allTilesets).setPipeline('Light2D');
		tierra = mapa.createLayer('tierra', allTilesets).setPipeline('Light2D');
		luz = mapa.createLayer('luz', allTilesets).setPipeline('Light2D');
		muros = mapa.createLayer('muros', allTilesets).setDepth(0).setPipeline('Light2D');
		objetos = mapa.createLayer('objetos', allTilesets).setDepth(7).setPipeline('Light2D');
		objetos2 = mapa.createLayer('objetos2', allTilesets).setDepth(4).setPipeline('Light2D');

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

		inventario.create();


		spawn = new Phaser.Math.Vector2(-980, 2250)

		console.log(scene.config)

		heroes.create(spawn, allTiles, antorchas, sc.config);
		jotun.create();
		oscuridad.create(scene, allTiles);

		tilePortal.forEach(obj => {

			if(obj.name == 'mago')
			{
				obj.setAlpha(0)
				mago.create(obj, sc.config);
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

		lago.setTileIndexCallback(freezeTiles, this.fallDeath, this.physics.add.overlap(heroes.heroes, lago));

		luz.setTileIndexCallback(darkTiles, oscuridad.encenderOscuridad, this.physics.add.overlap(heroes.heroes, luz));

		objetos.setTileIndexCallback(snowTiles, yasha.derretir, this.physics.add.overlap(yasha.grupoFuego, objetos));
		
		this.physics.add.collider(mago.mago, heroes.heroes);
		this.physics.add.collider(jotun.grupoEnemigos, heroes.heroes);
		this.physics.add.collider(bossHielo.boss, heroes.heroes);

		objetos.setCollisionByProperty({collides: true});
		muros.setCollisionByProperty({collides: true});
		objetos2.setCollisionByProperty({collides: true});

		portal.collisionPortal(heroes.heroes);

		this.physics.add.overlap(heroes.heroes, bossHielo.grupoDispBoss, heroes.herir, null, this);

		this.physics.add.overlap(heroes.heroes, jotun.grupoDispEnemigo, heroes.herir, null, this);

		this.physics.add.overlap(heroes.armasHeroicas, bossHielo.boss, bossHielo.quitarVida, null, this);

		this.physics.add.overlap(heroes.armasHeroicas, jotun.grupoEnemigos, jotun.quitarVida, null, this);

		dinero.create();
	}


	fallDeath(pj, layer)
	{
		if (!pj.inmovil)
		{

			pj.inmovil = true;
			pj.inmune = true;

			pj.setVelocityX(0);
			pj.setVelocityY(0);

			scene.tweens.addCounter({
				from: 100,
				to: 0,
				duration: 2000,
				onUpdate: function (tween)
				{
					var value255 = Math.floor(tween.getValue()/100 * 255);
					var value = Math.floor(tween.getValue());

					pj.setTint(Phaser.Display.Color.GetColor(value255, value255, value255));

					pj.angle = (100-value) * 5;

					pj.setScale(value * 0.01);

					if (value <= 0 && pj.heroe)
					{
						pj.x = spawn.x;
						pj.y = spawn.y;
						if (tween.getValue() <= 0)
						{
							pj.vida -= 2;
						}

						pj.angle = 0;

						pj.setTint(0xffffff)

						pj.setScale(1);

						pj.inmovil = false;
						pj.inmune = false;

						heroes.reHacerFila()
					}
					else if(value == 0 && pj.detectionbox != null)
					{
						pj.detectionbox.destroy()
						pj.destroy()
					}
					else if(value == 0)
					{
						pj.destroy()
					}
				}
			});
		}
	}
	update()
	{
		mago.update();
		heroes.update();
		portal.update();
		oscuridad.darkMode();
		mago.magoTrue(antorchas);
		jotun.updateDispEnem();
		bossHielo.updateNieblaBoss();
		bossHielo.update();
		jotun.update();
	}
}