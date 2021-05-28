import * as boxTank from '../personajes/robin.js';
import * as escorpion from '../enemies/escorpion.js';
import * as slime from '../enemies/slime.js';
import * as boss from '../enemies/boss_desierto.js';
import * as keys from '../keys.js';
import * as heroes from '../grupoHeroes.js';
import * as sc from '../sceneConstructor.js';
import * as dinero from '../dinero.js';

var llave = false;
var puerta = true;
var batalla = false;

export default class dessert extends Phaser.Scene {
  constructor(){
		super("dessert");
	}
  preload() {

	  this.load.image('tiles','tilemap/terrain.png');
	  this.load.tilemapTiledJSON('dessert','tilemap/mapita.json');

	  heroes.preload.call(this);
  	escorpion.preload.call(this);
	  slime.preload.call(this);
  	boss_desierto.preload.call(this);
    dinero.preload.call(this);
  }

  create() {

    // Tilemap

  	this.add.sprite(0,0,'tiles');

  	var map = this.make.tilemap({ key: 'dessert',});
  	var tileset = map.addTilesetImage('terrain', 'tiles');

  	var suelo = map.createLayer('Ground', tileset);
  	var oasis = map.createLayer('Agua', tileset);
  	var decoracion = map.createLayer('Decoracion', tileset);
  	var dunas = map.createLayer('Dunas', tileset);
  	var segundo_suelo = map.createLayer('Second_Ground', tileset);
  	var lava = map.createLayer('Lava', tileset);
  	var muro = map.createLayer('Pared', tileset);

    playerTileSpawner = map.createFromObjects('SpawnJugador');
    slimeTileSpawner = map.createFromObjects('SpawnSlime');           // 19
    superSlimeTileSpawner = map.createFromObjects('SpawnSuperSlime'); // 2
    escorpionTileSpawner = map.createFromObjects('SpawnEscorpion');   // 23
    bossTileSpawner = map.createFromObjects('SpawnBoss');
    objetosTileSpawner = map.createFromObjects('Objetos');
    
	  playerSpawnPoint = new Array();
    slimeTileSpawner = new Array();
    superSlimeTileSpawner = new Array();
    escorpionTileSpawner = new Array();
    objetosTileSpawner = new Array();

    // Crear grupos

    var allLayers1 = [oasis, dunas, lava, muro];
    var allLayers2 = [oasis, dunas, muro];

    boss_desierto.createFireBossGroup.call(allLayers2);
	  slime.createFireGroup.call(allLayers2);
	  escorpion.createGroup.call(allLayers1);
	  slime.createSlimeGroup.call(allLayers2)
	  slime.createSuperSlimeGroup.call(allLayers2);
    dinero.create.call(this);

    // Spawn

    playerTileSpawner.forEach(obj => {
      this.physics.world.enable(obj);
      obj.setAlpha(0);
      if(obj.name == 'Entrada'){
	      playerSpawnPoint.unshift(obj);
      }
      /*else if (obj.name == 'Npc') {

      }*/
    })

    var spawnID = playerSpawnPoint.lenght - 1;
    heroes.create(playerSpawnPoint[spawnID], allLayers, null, sc.config)

    slimeTileSpawner.forEach(obj=>{
      this.physics.world.enable(obj);
        obj.setAlpha(0);
      if (obj.name == 'S') {
        slime.createSlime(obj);
      }
    })
    superSlimeTileSpawner.forEach(obj=>{
      this.physics.world.enable(obj);
      obj.setAlpha(0);
      if (obj.name == 'SS') {
        slime.createSuperSlime(obj);
      }
    }
    escorpionTileSpawner.forEach(obj=>{
      this.physics.world.enable(obj);
      obj.setAlpha(0);
      if (obj.name == 'E') {
        escorpion.createEscorpion(obj);
      }
    }
    bossTileSpawner.forEach(obj=>{
      this.physics.world.enable(obj);
      obj.setAlpha(0);
      if (obj.name == 'E') {
        boss.create(obj);
      }
    }
    
    // Variables

	  segundo_suelo.alpha = 0;
    lava.tiempo = 0;

    // Colisiones

  	this.physics.add.collider(heroes.heroes, muro);
	  muro.setCollisionByProperty({collides: true});

	  // Camara

	  this.cameras.main.startFollow(heroes.heroes);	

	  // Texto

	  text=this.add.text(heroes.heroes.x-190,heroes.heroes.y-145,'Score: ',{fontsize:'8px',fill:'#FFF'});
	  const list = ['Vida:', 'life' ];
	  robin.setDataEnabled();
	  robin.data.set('life','12');

	  text.setText([
        'Vida: ' + robin.data.get('life')
    ]);

    // Controles

    keys.create(this)

    // Overlap

    this.physics.add.overlap(escorpionList, heroes.heroes, updateVida, null, this);
    this.physics.add.overlap(slimeList, heroes.heroes, updateVida, null, this);
    this.physics.add.overlap(superSlimeList, heroes.heroes, updateVida, null, this);
    this.physics.add.overlap(boss, heroes.heroes, updateVida, null, this);
    this.physics.add.overlap(dunas, heroes.heroes, updateDunas, null, this);
    this.physics.add.overlap(llave, heroes.heroes, cogerLlave, null, this);
    this.physics.add.overlap(lava, hielo, lavaFria, null, this);
    this.physics.add.overlap(lava, heroes.heroes, heroeFundido, null, this);
  }

  update() {

    // Actualizar personajes

	  heroes.update.call();
	  escorpion.update.call();
	  slime.updateSlime.call();
	  slime.updateSuperSlime.call();

    // Actualizar estado (vida) 

	  slime.updateVidaSlime.call();
	  slime.updateVidasuperSlime.call();
	  escorpion.updateVidaEscorpion.call();
	  // robin.updateVidaRobin.call();

	  // Puerta

	  if (llave) {
	  	puerta = false;
	  }

	  // Boss

	  if (batalla) {
	  	if (!creado) {
	  		boss_desierto.create.call();
	  		creado = true;
	  	}
	  	else {
	  		boss_desierto.update.call();
	  	}
  	}
	
    updateLava();

    // Actualizar texto

  	text.x = robin.x-190;
  	text.y = robin.y-145;
  }

  // Actualizar las dunas (quitarlas)

  updateDunas(d,h) {
	  if (keyE.isDown) {
		  d.alpha = 0;
	  }
  }

  // Coger objeto clave para continuar el nivel

  cogerLlave(l,h) {
	  if (keyE.isDown && !l) {
	  	l = true;
  	}
  }

  // Congelar la lava

  lavaFria(l,h) {
  	l.alpha = 0;
    l.tiempo = 1;
  	segundo_suelo.alpha = 1;
  }

  // Muerte por caer en la lava

 heroeFundido(l,h) {
	  if (l.alpha == 1) {
  		heroes.heroes.muerto = true;
	  }
  }

  // Actualizar la lava cuando se enfria

  updateLava() {
    if (lava.tiempo != 0) {
      lava.tiempo++;
    }
    if (lava.tiempo > 1000) {
      lava.alpha = 1;
      segundo_suelo.alpha = 0;
      lava.tiempo = 0;
    }
  }
}