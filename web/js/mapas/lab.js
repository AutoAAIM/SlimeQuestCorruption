import * as boxTank from '../personajes/boxTank.js';
import * as shapeShifter from '../enemies/shapeShifter.js';
import * as scyther from '../enemies/scyther.js';
import * as keys from '../keys.js';
import * as portal from '../portal.js';
import * as heroes from '../grupoHeroes.js';
import * as sc from '../sceneConstructor.js';
import * as dinero from '../dinero.js';

var tiempoEntreSpawn = 60;
var tiempoEntreHuellas = 0;
export var scene;
var fpsText;
var paredes;
var elementosMapa;
var elementosMapa2;
var allLayers;
var playerTileSpawner;
export var playerSpawnPoint;
export var spawnID;
var paredes
var obstaculos1
var obstaculos2
var obstaculosManiqui
//var player
//var emitterHumo
var emitterPolvo
var arenaEmitter
var arenaEmitter
//var balas
var huellas
//
var grupoEnemigos;
var deadlyTiles
var huellasTiles
var destructibleTiles1
var destructibleTiles2
var destructibleTiles3
var npc
//export var shapeShifterGroup
var text
var skullAG
var move
var gates

var music

//var game = new Phaser.Game(config);

export default class lab extends Phaser.Scene {
	constructor(){
		super("lab");
	}

	preload()
	{
		this.load.image('labtiles','assets/mapa/Labspritesheet.png');
		this.load.image('terraintiles','assets/mapa/terrain.png');
		this.load.image('maniquiReal','assets/mapa/maniquiReal.png');
		this.load.tilemapTiledJSON('laboratorio', 'assets/mapa/lab.json');

		this.load.image('polvo','assets/particles/polvo.png');

		this.load.spritesheet('SkullAG','assets/images/SkullAG.png', { frameWidth: 32, frameHeight: 48});

		this.load.audio('labchords', ['assets/music/lab-teaser.wav']);

		heroes.preload.call(this)
		portal.preload.call(this)
		shapeShifter.preload.call(this)
		scyther.preload.call(this)
		dinero.preload.call(this)
	}

	create()
	{
		scene = this;

		console.log(scene)
		console.log(scene.game.usuario)

		music = this.sound.add('labchords');

    	music.play();

		this.lights.enable().setAmbientColor(0x222222);

		/*fpsText = this.add.text(16,32,'FPS: '+ game.loop.actualFps,{fontsize:'8px',fill:'#FFF'}).setScrollFactor(0).setScrollFactor(0);*/

		//boxTank.createAnims()
		portal.createAnims()

		this.anims.create({
			key: 'shapeshifterTransform',
			frames: this.anims.generateFrameNumbers('shapeshifterSheet'),
			frameRate: 25,
			repeat: 0
		});

		this.anims.create({
			key: 'shapeshifterWalk',
			frames: this.anims.generateFrameNumbers('shapeshifterSheet2'),
			frameRate: 25,
			repeat: 0
		});

		this.anims.create({
			key: 'SkullAGAnim',
			frames: this.anims.generateFrameNumbers('SkullAG'),
			frameRate: 4,
			repeat: -1
		});

		const map = this.make.tilemap({key: 'laboratorio'});
		const tileset = map.addTilesetImage('Lab', 'labtiles');
		const tileset2 = map.addTilesetImage('terrain', 'terraintiles');
		const tileset3 = map.addTilesetImage('maniquiReal', 'maniquiReal');
		const allTilesets = [tileset, tileset2, tileset3];
		map.createLayer('fondo', allTilesets).setDepth(0).setPipeline('Light2D');
		paredes = map.createLayer('salas', allTilesets).setDepth(0).setPipeline('Light2D');
		elementosMapa = map.createLayer('elementosSuelo', allTilesets).setDepth(0).setPipeline('Light2D');
		elementosMapa2 = map.createLayer('elementosSuelo2', allTilesets).setDepth(1).setPipeline('Light2D');
		obstaculos1 = map.createLayer('obstaculos', allTilesets).setDepth(10).setPipeline('Light2D');
		obstaculos2 = map.createLayer('obstaculos2', allTilesets).setDepth(10).setPipeline('Light2D');
		obstaculosManiqui = map.createLayer('maniquis', allTilesets).setDepth(10).setPipeline('Light2D');

		allLayers = [paredes, obstaculos1, obstaculos2, obstaculosManiqui]
		
		playerTileSpawner = map.createFromObjects('Capa de Objetos 1');

		playerSpawnPoint = new Array();

		playerTileSpawner.forEach(obj => {
			this.physics.world.enable(obj);
			obj.setAlpha(0);

			obj.y+=32;

			playerSpawnPoint.unshift(obj);
		})

		spawnID = playerSpawnPoint.length-1;

		keys.create(scene)

		//pointer = this.input.activePointer;
		heroes.create(playerSpawnPoint[spawnID], allLayers, null, sc.config)

		paredes.setCollisionByProperty({ collides: true});
		obstaculos1.setCollisionByProperty({ collides: true});
		obstaculos2.setCollisionByProperty({ collides: true});
		obstaculosManiqui.setCollisionByProperty({ collides: true});

		const debubGraphics = this.add.graphics().setAlpha(0.55);

		document.body.style.cursor = 'none';

		emitterPolvo = scene.add.particles('polvo').setDepth(1);

		arenaEmitter = emitterPolvo.createEmitter({
			alpha: { start: 1, end: 0 },
			scale: { start: 0.25, end: 0.75 },
			//tint: { start: 0xff945e, end: 0xff945e },
			speed: 75,

			angle: -90,
			gravityY: 300,
			//accelerationx: 0,
			lifespan: { min: 400, max: 500 },
			//blendMode: 'ERASE',
			frequency: 100,
			tint: 0xf6c998
			//maxParticles: 10,
		});
		arenaEmitter.setPosition(heroes.cabeza.x, heroes.cabeza.y).stop();
		//heroes.ponerEmitter(arenaEmitter)

		huellas = this.add.group();

		scene.cameras.main.setLerp(0.1, 0.1);

		deadlyTiles = elementosMapa.filterTiles(tile => tile.properties.deadly).map(x => x.index);

		elementosMapa.setTileIndexCallback(deadlyTiles, this.fallDeath, this.physics.add.overlap(heroes.heroes, elementosMapa));

		huellasTiles = elementosMapa.filterTiles(tile => tile.properties.huellas).map(x => x.index);

		elementosMapa.setTileIndexCallback(huellasTiles, this.createHuellas, this.physics.add.overlap(heroes.heroes, elementosMapa));

		deadlyTiles = elementosMapa2.filterTiles(tile => tile.properties.deadly).map(x => x.index);

		elementosMapa2.setTileIndexCallback(deadlyTiles, this.fallDeath, this.physics.add.overlap(heroes.heroes, elementosMapa2));

		huellasTiles = elementosMapa2.filterTiles(tile => tile.properties.huellas).map(x => x.index);

		elementosMapa2.setTileIndexCallback(huellasTiles, this.createHuellas, this.physics.add.overlap(heroes.heroes, elementosMapa2));
		//elementosMapa.setTileIndexCallback(huellasTiles, createHuellas, this.physics.add.overlap(player, elementosMapa))

		destructibleTiles1 = obstaculos1.filterTiles(tile => tile.properties.destructible).map(x => x.index);
		//destructibleTiles.unshift(obstaculos2.filterTiles(tile => tile.properties.destructible).map(x => x.index));
		destructibleTiles2 = obstaculos2.filterTiles(tile => tile.properties.destructible).map(x => x.index);
		destructibleTiles3 = obstaculosManiqui.filterTiles(tile => tile.properties.destructible).map(x => x.index);
		//console.log(destructibleTiles[1])

		boxTank.setDestructibles(obstaculos1, destructibleTiles1)
		boxTank.setDestructibles(obstaculos2, destructibleTiles2)
		boxTank.setDestructibles(obstaculosManiqui, destructibleTiles3)

		//casa = elementosMapa._events.addedtoscene.context.culledTiles;
		//console.log(casa[2])
		//console.log(elementosMapa._events.addedtoscene.context)

		npc = map.createFromObjects('Capa de Objetos 2');

		//console.log(npc)

		gates = portal.create(npc);

		shapeShifter.create(allLayers);

		scyther.create(allLayers);

		scene.physics.add.overlap(heroes.heroes, shapeShifter.shapeShifterGroup, heroes.herir, null, scene);

		scene.physics.add.overlap(heroes.heroes, scyther.scytherSegmentsGroup, heroes.herir, null, scene);

		npc.forEach(obj => {
			//console.log(obj)
			if(obj.name == 'shapeshifter')
			{
				//shapeShifterGroup.add(obj)
				obj.setAlpha(0)
				shapeShifter.createShapeshifter(obj, grupoEnemigos);
			}
			if(obj.name == 'scyther')
			{
				//shapeShifterGroup.add(obj)
				obj.setAlpha(0)
				scyther.createScyther(obj, grupoEnemigos);
			}
			if(obj.name == 'SkullAG')
			{
				//shapeShifterGroup.add(obj)
				//createShapeshifter(obj);
				skullAG = this.add.sprite(obj.x, obj.y-8, 'SkullAG').setDepth(5)
				skullAG.play('SkullAGAnim', true)
				obj.destroy()
			}
		})
		elementosMapa.setTileIndexCallback(deadlyTiles, this.fallDeath, this.physics.add.overlap(shapeShifter.shapeShifterGroup, elementosMapa));
		elementosMapa2.setTileIndexCallback(deadlyTiles, this.fallDeath, this.physics.add.overlap(shapeShifter.shapeShifterGroup, elementosMapa2));

		grupoEnemigos..setPipeline('Light2D');

		//this.physics.add.overlap(boxTank.player.taladro, shapeShifterGroup, herir, null, this);
		//;text.setText('vida: ' + boxTank.player.vida, boxTank.player.x, boxTank.player.y);

		//console.log(this)
		portal.collisionPortal(shapeShifter.shapeShifterGroup)
		portal.collisionPortal(heroes.heroes)

		scene.physics.add.overlap(heroes.armasHeroicas, shapeShifter.shapeShifterGroup, shapeShifter.herir, null, scene);
		scene.physics.add.overlap(heroes.armasHeroicas, scyther.scytherGroup, scyther.herir, null, scene);

		dinero.create();
	}

	createHuellas(obj,layer)
	{
		//console.log(layer)
		//console.log(layer.index)
		//console.log(huellasTilesId.pop('6'))

		//layer.index
		/*if (layer.properties.huellas)
		{
			layer.properties.huellas=false
		}*/
		if (tiempoEntreHuellas <= 0 && (obj.move || heroes.cabeza.move))
		{
			//obj.emitter.emit('bum', obj.x, obj.y);
			//tiempoEntreHuellas = 10;
			if(obj.piesY != null)
			{
				arenaEmitter.emitParticleAt(obj.x, obj.y+obj.piesY)
			}
			else{arenaEmitter.emitParticleAt(obj.x, obj.y+obj.height/2-obj.height/6)}
			
			/*var h = huellas.create(obj.x, obj.y,'huellas').setAlpha(0.25);
			h.setDepth(0)
			h.tiempoVida = 120;*/
		}
		//tiempoEntreHuellas--;
		//console.log(obj.tiempoEntreHuellas)
	}

	fallDeath(pj, layer)
	{
		if (!pj.inmovil)
		{
			//console.log('Deberias estar muerto')

			pj.inmovil = true;
			pj.inmune = true;
			boxTank.player.emitter.stop();

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
					//console.log(tween.getValue())

					if (value <= 0 && pj.heroe)
					{
						pj.x = playerSpawnPoint[spawnID].x;
						pj.y = playerSpawnPoint[spawnID].y;
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
						//pj.detectionbox = null;
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

	update(time, delta)
	{
		//console.log(pointer)
		//console.log(Keys)
		console.log(scene.game.usuario.dinero)
		heroes.update();
		//alert(time + " -- "+ delta)

		//fpsText.text = "FPS: "+game.loop.actualFps;

		//tiempoEntreHuellas--;

		//updateHuellas();
		shapeShifter.update()
		scyther.update()

		if (tiempoEntreHuellas <= 0)
		{
			tiempoEntreHuellas = 5;
		}
		tiempoEntreHuellas--;

		portal.update()

		//console.log(pointer.event.button)
		
	}
}