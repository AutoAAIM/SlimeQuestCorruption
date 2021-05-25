
export var enemigoMosquito;
var scene;
var config;
export var mosquitosGrupo;
import * as glish from '../personajes/glish.js';
import * as heroes from '../grupoHeroes.js';
import * as enemigos from './enemigos.js';

export function preload(){
  this.load.spritesheet('mosq','assets/images/mosqui.png', { frameWidth: 32, frameHeight: 32});
  scene = this;


}

export function create(){
    mosquitosGrupo = scene.physics.add.group();
    scene.physics.add.collider(mosquitosGrupo, mosquitosGrupo);
}

export function createEnemyMosquito(obj, conf){
    config = conf;
    enemigoMosquito = mosquitosGrupo.create(obj.x,obj.y, 'mosq').setOrigin(0.5); 
    enemigoMosquito.name = 'mosquito';
    enemigoMosquito.vida = 7;
    enemigoMosquito.dano = 1;
    enemigoMosquito.inmune = -1;
    enemigoMosquito.status = "none";
    enemigoMosquito.tiempoMoverse = 100;
    enemigoMosquito.trigger = scene.add.rectangle(enemigoMosquito.x,enemigoMosquito.y, config.width/1.5, config.height/1.5);
    scene.physics.add.existing(enemigoMosquito.trigger, false);
    enemigoMosquito.trigger.activado = false;

    scene.anims.create({
      key: 'fly',
      frames: scene.anims.generateFrameNumbers('mosq'),
      frameRate: 15,
      repeat: -1
    });

}