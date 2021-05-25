import * as utilidades from '../utilidades.js';
import * as glish from '../personajes/glish.js';
import * as heroes from '../grupoHeroes.js';
import * as ranas from '../enemies/ranas.js';
import * as mosquitos from '../enemies/mosquitos.js';
import * as enemigos from '../enemies/enemigos.js';

var npc1, scene, interacturar, keyE, dialogo, dialogoText;

export function preload() {
  this.load.spritesheet('npc1', 'assets/images/Glish.png', { frameWidth: 32, frameHeight: 32 });
  this.load.image('dialogo', 'assets/images/dialogo.png');
  this.load.spritesheet('buttonE', 'assets/images/buttonE.png', { frameWidth: 22, frameHeight: 44 });
  scene = this;
}

export function create(obj) {

  keyE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

  npc1 = scene.physics.add.sprite(obj.x, obj.y, 'npc1');
  interacturar = scene.physics.add.sprite(obj.x, obj.y-32, 'buttonE');
  dialogo = scene.physics.add.sprite(npc1.x+46, npc1.y-42, 'dialogo').setScale(1.7);;
  dialogoText = scene.add.text(dialogo.x-32, dialogo.y-16, 'ranas: ' + enemigos.contadorRana + '\n mosquitos:'+ mosquitos.contadorMosquitos, { fontsize: '2px', fill: '#62f5cb' }).setDepth(1)
  npc1.trigger = scene.add.rectangle(npc1.x,npc1.y, 90, 90);
  scene.physics.add.existing(npc1.trigger, false);
  npc1.trigger.activado = false;

	scene.anims.create({
		key: 'inter',
		frames: scene.anims.generateFrameNumbers('buttonE'),
		frameRate: 2,
		repeat: -1
	});

  scene.physics.add.overlap(heroes.cabeza, npc1.trigger, activarTrigger, null, scene);
  scene.physics.add.overlap(heroes.cabeza, npc1, recogerPersonaje, null, scene);

}

function activarTrigger(player, npc){
  
  interacturar.setPosition(player.x, player.y - 32);
  interacturar.setDepth(1);
  interacturar.anims.play('inter', true);

  if(keyE.isDown){
    dialogo.setAlpha(1);
    dialogoText.setAlpha(1);
  }

}

function recogerPersonaje(){
  if(enemigos.contadorRana > 0 && mosquitos.contadorMosquitos > 0){
    console.log("todavia no puedes");
  }else if(enemigos.contadorRana == 0 && mosquitos.contadorMosquitos == 0){
    console.log("soy tuyo");
  }
}

export function update(){

  if(Phaser.Geom.Intersects.RectangleToRectangle(heroes.cabeza.getBounds(), npc1.trigger.getBounds())){
    interacturar.setAlpha(1);

  }else{
    interacturar.setAlpha(0);
        dialogo.setAlpha(0);
    dialogoText.setAlpha(0);
  }
  dialogoText.text = "ranas: " + enemigos.contadorRana + "\n mosquitos:"+ mosquitos.contadorMosquitos;

}