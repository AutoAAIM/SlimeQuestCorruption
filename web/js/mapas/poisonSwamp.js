import * as glish from '../personajes/glish.js';
import * as heroes from '../grupoHeroes.js';
import * as ranas from '../enemies/ranas.js';
import * as mosquitos from '../enemies/mosquitos.js';
import * as utilidades from '../utilidades.js';
import * as enemigos from '../enemies/enemigos.js';
import * as portal from '../portal.js';
import * as keys from '../keys.js';
import * as npc from '../NPCs/PantanoNPC.js';
import * as swampBoss from '../enemies/SwampBoss.js'
import * as sc from '../sceneConstructor.js';

var scene;
var camera;
var fondoAguaBuena;
var fondo;
var tileSpawner;
export var enemyList;
var bossMuerto = false;
var suelo;
var poisonTiles;
var poisonAspectTiles;
var poisonTilesId;
var cutTiles;
var cutTilesId;
var cutTiles2;
var cutTilesId2;
var allLayers;


export default class swamp extends Phaser.Scene {
	constructor(){
		super("swamp");
	}

    preload(){
        this.load.image('tiles', 'assets/mapa/terrain.png');
        this.load.image('tiles2', 'assets/mapa/terrain2.png');
        this.load.image('tiles3', 'assets/mapa/terrain3.png');
        this.load.tilemapTiledJSON('pantano', 'assets/mapa/PantanoVenenosoVerdadero.json');
        heroes.preload.call(this)
        ranas.preload.call(this);
        mosquitos.preload.call(this);
        portal.preload.call(this);
        npc.preload.call(this);
        swampBoss.preload.call(this);
    }
/*
  =======    =========    ========    =======    ===============    ========
  =          =       =    =           =     =           =           =
  =          =       =    =           =     =           =           =
  =          ========     =======     =======           =           =======
  =          =     =      =           =     =           =           =
  =          =      =     =           =     =           =           =
  =======    =       =    ========    =     =           =           ========
*/
    create(){

        scene = this;
        document.body.style.cursor = "none";
        camera = this.cameras.main;
        const map = this.make.tilemap({key:"pantano"});

        const tileset = map.addTilesetImage("terreno", "tiles");
        const tileset2 = map.addTilesetImage("terreno2", "tiles2");
        const tileset3 = map.addTilesetImage("terreno3", "tiles3");

        suelo = map.createLayer('ground', tileset2).setDepth(-3);
        fondoAguaBuena = map.createLayer('ground2', tileset2).setDepth(-1);
        fondo = map.createLayer('AguaMala', tileset2).setDepth(-1);
        scene.obstaculos = map.createLayer('Obstaculos', tileset);
        scene.obstaculos2 = map.createLayer('obstaculo2', tileset).setDepth(-1);
        scene.obstaculos3 = map.createLayer('obstaculo3', tileset).setDepth(-1);
        scene.copaDeArbol = map.createLayer('copaDelArbol', tileset).setDepth(3);
        scene.casa2 = map.createLayer('casa2', tileset3);
        scene.casa1 = map.createLayer('casa1', tileset3);
        tileSpawner = map.createFromObjects('RespawnEnemigos');
        //allLayers = [scene.obstaculos, scene.obstaculos2, scene.obstaculos3, scene.casa1, scene.casa2]

        //scene.obstaculos.setCollisionByProperty({collides:true});
        //scene.obstaculos2.setCollisionByProperty({collides:true});
        //scene.obstaculos2.setCollisionByProperty({cut_attack:true});
        //scene.casa1.setCollisionByProperty({collides:true});
        //scene.casa2.setCollisionByProperty({collides:true});
        //scene.obstaculos3.setCollisionByProperty({collides:true});
        //scene.obstaculos3.setCollisionByProperty({cut_attack:true});
        //Movimiento del veneno
        this.tweens.timeline({
            targets: fondo, duration: 1500,
            loop: -1,
            tweens: [{ alpha: 0.7, }, { alpha: 1, },],
        });
        enemyList = this.physics.add.group();
        enemyList.lengua = this.physics.add.group();
        tileSpawner.forEach(obj => {
            this.physics.world.enable(obj);
            obj.setAlpha(0);
            if(obj.name == 'rana'){
                ranas.createEnemyRana(obj, sc.config, enemyList);
            }else if(obj.name == 'mosquito'){
                mosquitos.createEnemyMosquito(obj, sc.config, enemyList);
            }else if(obj.name == 'conseguir_glish'){
                npc.create(obj);        
            }else if(obj.name == 'BossCalamar' && !bossMuerto){
                swampBoss.createBoss(obj, sc.config, enemyList);
            }else if(obj.name == 'tentaculos' && !bossMuerto){
                swampBoss.generateTentacles(obj);
            }else if(obj.name == 'entrada_3'){
                heroes.create(obj, allLayers, null, sc.config)
            }

        })
        //portal.createAnims();
        //portal.create(tileSpawner);
        
        //Overlap
        //poisonTiles = fondo.filterTiles(tile => tile.properties.veneno).map(x => x.index);

        //poisonAspectTiles = fondo.filterTiles(tile => tile.properties.aspectoVeneno).map(x => x.index);

        //poisonTilesId = [...(new Set(poisonTiles))];
        //fondo.setTileIndexCallback(poisonTilesId, heroes.poisonPlayer, this.physics.add.overlap(heroes.heroes, fondo));

        //fondo.setTileIndexCallback(poisonTilesId, heroes.poisonPlayer, this.physics.add.overlap(glish.ondaList, fondo));

        //fondo.setTileIndexCallback(poisonAspectTiles, heroes.poisonPlayer, this.physics.add.overlap(glish.ondaList, fondo));

        //cutTiles = scene.obstaculos2.filterTiles(tile => tile.properties.cut_attack).map(x => x.index);
        //cutTilesId = [...(new Set(cutTiles))];

        //cutTiles2 = scene.obstaculos3.filterTiles(tile => tile.properties.cut_attack).map(x => x.index);
        //cutTilesId2 = [...(new Set(cutTiles2))];

        //scene.obstaculos2.setTileIndexCallback(cutTilesId, glish.climbing_plant, this.physics.add.overlap(glish.beamList, scene.obstaculos2));

        //scene.obstaculos3.setTileIndexCallback(cutTilesId2, glish.climbing_plant, this.physics.add.overlap(glish.beamList, scene.obstaculos3));

        //this.physics.add.overlap(enemyList, heroes.armasHeroicas, enemigos.recibirDanyo);

        //this.physics.add.overlap(heroes.cabeza,enemyList, heroes.herir);
        //this.physics.add.overlap(heroes.cabeza,swampBoss.tentacleSegmentsGroup, heroes.herir);
        //.physics.add.overlap(swampBoss.enemigoBoss, heroes.armasHeroicas,enemigos.recibirDanyo);
        //this.physics.add.overlap(heroes.cabeza,swampBoss.enemigoBoss, heroes.herir);


        //Colisiones

        //this.physics.add.collider(enemyList, enemyList);

        //portal.collisionPortal(heroes.heroes)
    }
/*
 =        =   ==========     ========     =======    =============    ========
 =        =    =        =    =       =    =     =          =          =
 =        =    =        =    =        =   =     =          =          =
 =        =    =========     =        =   =======          =          ======
 =        =    =             =        =   =     =          =          =
 =        =    =             =       =    =     =          =          =
  ========     =             ========     =     =          =          ========
*/
    update(time, delta){
      console.log("estoy jodido");
      
      heroes.update();

      enemigos.updateEnemySwamp(scene, enemyList);

      swampBoss.updateBoss();

      portal.update();

      npc.update();
    

    }

}