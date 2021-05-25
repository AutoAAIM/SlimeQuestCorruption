
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

export function update(){
    Phaser.Actions.Call(mosquitosGrupo.getChildren(), function(go) {
        if (go.trigger.activado){
            //console.log();
            go.trigger.x = go.x;
            go.trigger.y = go.y;
            if(go.name == 'mosquito' && go.status != "paralizado"){
                scene.physics.moveTo(go, heroes.cabeza.x, heroes.cabeza.y, Phaser.Math.Between(130, 140));
                go.play('fly', true);  
                if(go.x < heroes.cabeza.x){
                  go.flipX = true;
                }else{
                  go.flipX = false;
                }
            }

            if(go.status == "paralizado" && go.temporizador !=0){
                go.temporizador--;
                go.setVelocity(0);
            }
            if(go.temporizador == 0){
                go.status = "none";
            }
            if(go.tiempoMoverse != 0){
                go.tiempoMoverse--;

            }
        }
        if(go.inmune >= 0){
            go.inmune--;
        }
    }); 
}