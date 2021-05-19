import * as sc from '../sceneConstructor.js';

var scene
var sky

var cuadroTexto
var playButton

export default class registrar extends Phaser.Scene {
	constructor(){
		super("registrar");
	}

	preload()
	{
		this.load.image('sky','assets/images/fondo_menu.jpg');
		this.load.spritesheet('play','assets/images/play button.png', { frameWidth: 32, frameHeight: 32});
	}

	create()
	{
		scene = this;

		scene.anims.create({
			key: 'playAnim',
			frames: scene.anims.generateFrameNumbers('play'),
			frameRate: 1,
			repeat: -1
		});

		sky=this.add.tileSprite(0,0,sc.config.width*2,sc.config.height*2,'sky').setOrigin(0);
		sky.setScale(0.65);

		cuadroTexto = scene.add.rectangle(sc.config.width/2, sc.config.height-50, sc.config.width, 100, 0xaaaaaa);
		cuadroTexto = scene.add.rectangle(sc.config.width/2, sc.config.height-50, sc.config.width-8, 100-8, 0x000000);

		playButton = scene.physics.add.sprite(32, sc.config.height/2+30, 'play').setDepth(20);
		playButton.play('playAnim', true)
		playButton.setInteractive();

		playButton.on('pointerdown', function () {
			scene.scene.stop(scene);
			scene.scene.launch('lab')
		});
	}

	update(time, delta)
	{
		sky.tilePositionX+=2;
	}
}