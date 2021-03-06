import * as heroes from '../grupoHeroes.js';
import * as glish from '../personajes/glish.js';
import * as boxTank from '../personajes/boxTank.js';
import * as ranas from '../enemies/ranas.js';
import * as mosquitos from '../enemies/mosquitos.js';
import * as utilidades from '../utilidades.js';
import * as enemigos from '../enemies/enemigos.js';
import * as portal from '../portal.js';
import * as keys from '../keys.js';
import * as inventario from '../inventario.js';
import * as npc from '../NPCs/PantanoNPC.js';
import * as swampBoss from '../enemies/SwampBoss.js'
import * as dinero from '../dinero.js';
import * as sc from '../sceneConstructor.js';

var scene;
var camera;
var fondoAguaBuena;
var fondo;
var tileSpawner;
export var enemyList;
export var spawnID;
export var playerSpawnPoint;
var suelo;
var poisonTiles;
var poisonAspectTiles;
var poisonTilesId;
var cutTiles;
var cutTilesId;
var cutTiles2;
var cutTilesId2;
var allLayers;
var destructibleTiles1;
var destructibleTiles2;

var obstaculos;
var obstaculos2;
var obstaculos3;
var copaDeArbol;
var casa1;
var casa2;

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
        dinero.preload.call(this);
        inventario.preload.call(this)
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
        
		keys.create(scene);
        mosquitos.create();
        ranas.create();
        
        document.body.style.cursor = "none";
        camera = this.cameras.main;
        
        const map = this.make.tilemap({key:"pantano"});

        const tileset = map.addTilesetImage("terreno", "tiles");
        const tileset2 = map.addTilesetImage("terreno2", "tiles2");
        const tileset3 = map.addTilesetImage("terreno3", "tiles3");

        suelo = map.createLayer('ground', tileset2).setDepth(-3);
        fondoAguaBuena = map.createLayer('ground2', tileset2).setDepth(-1);
        fondo = map.createLayer('AguaMala', tileset2).setDepth(-1);
        obstaculos = map.createLayer('Obstaculos', tileset);
        obstaculos2 = map.createLayer('obstaculo2', tileset).setDepth(-1);
        obstaculos3 = map.createLayer('obstaculo3', tileset).setDepth(-1);
        copaDeArbol = map.createLayer('copaDelArbol', tileset).setDepth(3);
        casa2 = map.createLayer('casa2', tileset3);
        casa1 = map.createLayer('casa1', tileset3);
        tileSpawner = map.createFromObjects('RespawnEnemigos');
        allLayers = [obstaculos, obstaculos2, obstaculos3, casa1, casa2]

        obstaculos.setCollisionByProperty({collides:true});
        obstaculos2.setCollisionByProperty({collides:true});
        obstaculos2.setCollisionByProperty({cut_attack:true});
        casa1.setCollisionByProperty({collides:true});
        casa2.setCollisionByProperty({collides:true});
        obstaculos3.setCollisionByProperty({collides:true});
        obstaculos3.setCollisionByProperty({cut_attack:true});
        //Movimiento del veneno
        this.tweens.timeline({
            targets: fondo, duration: 1500,
            loop: -1,
            tweens: [{ alpha: 0.7, }, { alpha: 1, },],
        });
        enemyList = this.physics.add.group();
        enemyList.lengua = this.physics.add.group();
        
        playerSpawnPoint = new Array();

        tileSpawner.forEach(obj => {
            this.physics.world.enable(obj);
            obj.setAlpha(0);
            if(obj.name == 'entrada_3'){
			    playerSpawnPoint.unshift(obj);
            }
        })

		spawnID = playerSpawnPoint.length-1;
        heroes.create(playerSpawnPoint[spawnID], allLayers, null, sc.config)

        tileSpawner.forEach(obj=>{
            this.physics.world.enable(obj);
            obj.setAlpha(0);
            if(obj.name == 'rana'){
                ranas.createEnemyRana(obj, sc.config);
            }else if(obj.name == 'mosquito'){
                mosquitos.createEnemyMosquito(obj, sc.config);
            }else if(obj.name == 'conseguir_glish' && scene.game.glishActivarCuracion != true){
                npc.create(obj, sc.config);   
            }else if(obj.name == 'BossCalamar' && scene.game.bossMuerto != true){
                swampBoss.createBoss(obj, sc.config);
            }else if(obj.name == 'tentaculos' && scene.game.bossVivo != true){
                swampBoss.generateTentacles(obj);
            }
        })

		inventario.create();
        
        portal.createAnims();
        portal.create(tileSpawner);
        
        //Overlap
        poisonTiles = fondo.filterTiles(tile => tile.properties.veneno).map(x => x.index);

        poisonAspectTiles = fondo.filterTiles(tile => tile.properties.aspectoVeneno).map(x => x.index);

        poisonTilesId = [...(new Set(poisonTiles))];
        fondo.setTileIndexCallback(poisonTilesId, heroes.poisonPlayer, this.physics.add.overlap(heroes.heroes, fondo));

        fondo.setTileIndexCallback(poisonTilesId, heroes.poisonPlayer, this.physics.add.overlap(glish.ondaList, fondo));

        fondo.setTileIndexCallback(poisonAspectTiles, heroes.poisonPlayer, this.physics.add.overlap(glish.ondaList, fondo));

        cutTiles = obstaculos2.filterTiles(tile => tile.properties.cut_attack).map(x => x.index);
        cutTilesId = [...(new Set(cutTiles))];

        cutTiles2 = obstaculos3.filterTiles(tile => tile.properties.cut_attack).map(x => x.index);
        cutTilesId2 = [...(new Set(cutTiles2))];

        destructibleTiles1 = obstaculos2.filterTiles(tile => tile.properties.destructible).map(x => x.index);

        destructibleTiles2 = obstaculos3.filterTiles(tile => tile.properties.destructible).map(x => x.index);

        obstaculos2.setTileIndexCallback(cutTilesId, glish.climbing_plant, this.physics.add.overlap(glish.beamList, obstaculos2));

        obstaculos3.setTileIndexCallback(cutTilesId2, glish.climbing_plant, this.physics.add.overlap(glish.beamList, obstaculos3));

        boxTank.setDestructibles(obstaculos2, destructibleTiles1);
        boxTank.setDestructibles(obstaculos3, destructibleTiles2);

        this.physics.add.overlap(heroes.armasHeroicas, mosquitos.mosquitosGrupo, mosquitos.recibirDanyo);
        this.physics.add.overlap(heroes.armasHeroicas, ranas.ranaGrupo, ranas.recibirDanyo);
        this.physics.add.overlap(heroes.armasHeroicas, swampBoss.enemigoBoss, swampBoss.recibirDanyo);

        this.physics.add.overlap(heroes.heroes, mosquitos.mosquitosGrupo, heroes.herir);
        this.physics.add.overlap(heroes.heroes, ranas.ranaGrupo, heroes.herir);

        this.physics.add.overlap(heroes.heroes, swampBoss.tentacleSegmentsGroup, heroes.herir);
        this.physics.add.overlap(heroes.heroes, swampBoss.enemigoBoss, heroes.herir);

        this.physics.add.overlap(heroes.cabeza, swampBoss.enemigoBoss.trigger, swampBoss.activarTrigger);
        //this.physics.add.overlap(heroes.armaHeroicas, swampBoss.enemigoBoss, swampBoss.activarTrigger);

        portal.collisionPortal(heroes.heroes)

        dinero.create();
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
      
        heroes.update();
        
        mosquitos.update();
        ranas.update();
        if(scene.game.bossVivo != true){
            swampBoss.updateBoss();
        }
       

        portal.update();
        if(scene.game.glishActivarCuracion != true){
            npc.update();
        }
    

    }

}