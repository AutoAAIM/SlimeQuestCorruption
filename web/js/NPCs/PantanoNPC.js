import * as utilidades from '../utilidades.js';
import * as glish from '../personajes/glish.js';
import * as heroes from '../grupoHeroes.js';
import * as ranas from '../enemies/ranas.js';
import * as mosquitos from '../enemies/mosquitos.js';
import * as enemigos from '../enemies/enemigos.js';

var npc1, scene, interacturar, keyE, dialogo, dialogoText2, dialogoText, cuadroTexto, cuadroTexto2;

export function preload() {
  this.load.spritesheet('npc1', 'assets/images/Glish.png', { frameWidth: 32, frameHeight: 32 });
  this.load.image('dialogo', 'assets/images/dialogo.png');
  this.load.spritesheet('buttonE', 'assets/images/buttonE.png', { frameWidth: 22, frameHeight: 44 });
  scene = this;
}

export function create(obj, config) {

  keyE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

  npc1 = scene.physics.add.sprite(obj.x, obj.y, 'npc1');
  interacturar = scene.physics.add.sprite(obj.x, obj.y-32, 'buttonE');
  
    cuadroTexto = scene.add.rectangle(config.width / 2 + config.width, config.height / 2 + config.height - 50, config.width, 100, 0xaaaaaa).setDepth(16).setScrollFactor(0);

    cuadroTexto2 = scene.add.rectangle(config.width / 2 + config.width / 2, config.height / 2 + config.height - 50, config.width - 8, 100 - 8, 0x000000).setDepth(17).setScrollFactor(0);

    dialogoText2 = scene.add.text(heroes.cabeza.x - config.width / 2 + 16, heroes.cabeza.y - config.height / 2 + 210, 'Skull: Ayudadme a financiar el laborarorio!\nusad los numeros para comprar. \n1.pan = 15 Plorts          \n2.pastel = 50 Plorts', {fontSize: '12px', fill: '#68FF00', fontFamily: 'sans-serif'}).setDepth(18).setScrollFactor(0);

   = scene.add.text(dialogo.x-32, dialogo.y-16, 'ranas: ' + ranas.contadorRana + '\n mosquitos:'+ mosquitos.contadorMosquitos, { fontsize: '2px', fill: '#62f5cb' }).setDepth(1)
  
  
  npc1.trigger = scene.add.rectangle(npc1.x,npc1.y, 90, 90);
  scene.physics.add.existing(npc1.trigger, false);
  npc1.trigger.activado = false;

	scene.anims.create({
		key: 'inter',
		frames: scene.anims.generateFrameNumbers('buttonE'),
		frameRate: 2,
		repeat: -1
	});

  scene.physics.add.overlap(heroes.heroes, npc1.trigger, activarTrigger, null, scene);
  scene.physics.add.overlap(heroes.heroes, npc1, recogerPersonaje, null, scene);

}

function activarTrigger(player, npc){
  
  interacturar.setPosition(player.x, player.y - 32);
  interacturar.setDepth(1);
  interacturar.anims.play('inter', true);

  if(keyE.isDown){
    dialogo.setAlpha(1);
    dialogoText2.setAlpha(1);
  }

}

function recogerPersonaje(){
  if(ranas.contadorRana > 0 && mosquitos.contadorMosquitos > 0){

  }else if(ranas.contadorRana == 0 && mosquitos.contadorMosquitos == 0){
        scene.game.glishActivarCuracion = true;
        //glish.activarCuracion(true);
        npc1.trigger.destroy();
        npc1.destroy();
        dialogoText2.destroy();
        dialogo.destroy();
        interacturar.destroy();

  }
}

export function update(){

  if(Phaser.Geom.Intersects.RectangleToRectangle(heroes.cabeza.getBounds(), npc1.trigger.getBounds())){
    interacturar.setAlpha(1);

  }else{
    interacturar.setAlpha(0);
        dialogo.setAlpha(0);
    dialogoText2.setAlpha(0);
  }
  dialogoText2.text = "ranas: " + ranas.contadorRana + "\n mosquitos:"+ mosquitos.contadorMosquitos;

}