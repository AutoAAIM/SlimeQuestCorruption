import * as sc from '../sceneConstructor.js';

var scene
var sky

var cuadroTexto

export default class registrar extends Phaser.Scene {
	constructor(){
		super("registrar");
	}

	preload()
	{
		this.load.image('sky','assets/images/fondo_menu.jpg');
	}

	create()
	{
		scene = this;

		sky=this.add.tileSprite(0,0,sc.config.width*2,sc.config.height*2,'sky').setOrigin(0);
		sky.setScale(0.65);

		cuadroTexto = scene.add.rectangle(sc.config.width/2, sc.config.height-50, 200, 100, 0x000000);
	}

	update(time, delta)
	{
		sky.tilePositionX+=2;
	}
}