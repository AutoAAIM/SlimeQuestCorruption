import * as utilidades from '../utilidades.js';
import * as glish from '../personajes/glish.js';
import * as heroes from '../grupoHeroes.js';
import * as ranas from '../enemies/ranas.js';
import * as mosquitos from '../enemies/mosquitos.js';
import * as enemigos from '../enemies/enemigos.js';

var npc1, scene, interacturar, keyE, dialogo, dialogoText2, dialogoText, cuadroTexto, cuadroTexto2, tiempoAdios;
export var pan;

export function preload() {
    this.load.spritesheet('npc1', 'assets/images/Glish.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('dialogo', 'assets/images/dialogo.png');
    this.load.spritesheet('buttonE', 'assets/images/buttonE.png', { frameWidth: 22, frameHeight: 44 });
    this.load.image('panes', 'assets/images/pan.png');
  scene = this;
}

export function create(obj, config) {

    keyE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    npc1 = scene.physics.add.sprite(obj.x, obj.y, 'npc1');
    interacturar = scene.physics.add.sprite(obj.x, obj.y-32, 'buttonE');
  
    cuadroTexto = scene.add.rectangle(config.width / 2,config.height - 50, config.width, 100, 0xaaaaaa).setDepth(100).setScrollFactor(0);

    cuadroTexto2 = scene.add.rectangle(config.width / 2,config.height - 50, config.width - 8, 100 - 8, 0x000000).setDepth(101).setScrollFactor(0);

    dialogoText2 = scene.add.text(16,210, 'Por favor si quieres la habilidad de quitar el veneno \nayudame a cazar la cena. \nnecesito estos ingredientes\nranas: ' + ranas.contadorRana + '\n mosquitos:'+ mosquitos.contadorMosquitos, {fontSize: '12px', fill: '#68FF00', fontFamily: 'sans-serif'}).setDepth(102).setScrollFactor(0);
  
    scene.dialogoText3 = scene.add.text(npc1.x-32,npc1.y-32, 'Acercate a mi', {fontSize: '12px', fill: '#68FF00', fontFamily: 'sans-serif'}).setDepth(102);

    pan = scene.physics.add.sprite(npc.x-50, npc.y, 'panes').setDepth(10);

    scene.dialogoText4 = scene.add.text(npc1.x-42,npc1.y-64, 'Es la hora de cenar', {fontSize: '12px', fill: '#68FF00', fontFamily: 'sans-serif'}).setDepth(102);

    tiempoAdios == 120;
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
    scene.physics.add.overlap(heroes.heroes, pan, recogerPan, null, scene);

}

function activarTrigger(player, npc){
  
    interacturar.setPosition(player.x, player.y - 32);
    interacturar.setDepth(1);
    interacturar.anims.play('inter', true);

    if(keyE.isDown){
        cuadroTexto.setAlpha(1);
        cuadroTexto2.setAlpha(1);
        dialogoText2.setAlpha(1);

    }

    if(ranas.contadorRana == 0 && mosquitos.contadorMosquitos == 0){
        scene.dialogoText3.setAlpha(1);

    }

}

function recogerPersonaje(){
    if(ranas.contadorRana == 0 && mosquitos.contadorMosquitos == 0){
        scene.dialogoText4.setAlpha(1);
        scene.dialogoText3.setAlpha(0);
        if(tiempoAdios <= 0){
            scene.game.glishActivarCuracion = true;
            npc1.trigger.destroy();
            npc1.destroy();
            dialogoText2.destroy();
            cuadroTexto.destroy();
            cuadroTexto2.destroy();
            scene.dialogoText3.destroy();
            interacturar.destroy();
        }else {tiempoAdios --;}
    }
}

function recogerPan(){
    if(ranas.contadorRana == 0 && mosquitos.contadorMosquitos == 0){
        pan.destroy();
        generarPan();
    }
}

export function update(){

  if(Phaser.Geom.Intersects.RectangleToRectangle(heroes.cabeza.getBounds(), npc1.trigger.getBounds())){
    interacturar.setAlpha(1);

  }else{
    interacturar.setAlpha(0);
    cuadroTexto.setAlpha(0);
    cuadroTexto2.setAlpha(0);
    dialogoText2.setAlpha(0);
    scene.dialogoText3.setAlpha(0);
    scene.dialogoText4.setAlpha(0);
  }
  dialogoText2.text = 'Por favor si quieres la habilidad de quitar el veneno \nayudame a cazar la cena. \nnecesito estos ingredientes\nranas: ' + ranas.contadorRana + '\n mosquitos:'+ mosquitos.contadorMosquitos;

}