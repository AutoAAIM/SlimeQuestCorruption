import * as heroes from '../grupoHeroes.js';
import * as dinero from '../dinero.js'
import * as inventario from '../inventario.js'

var scene;
var textoSkull = false;
var cuadroTexto;
var cuadroTexto2;
var imagenTexto;
var config;
var skull;

export function preload()
{
	this.load.spritesheet('Skull','assets/images/SkullAG.png', { frameWidth: 32, frameHeight: 48});
	this.load.spritesheet('cakeTienda', 'assets/images/strange_cake.png', {frameWidth:32, frameHeight:32});
	this.load.image('panTienda', 'assets/images/pan.png');

	scene = this;
}

export function create(obj, conf)
{
	scene.anims.create({
		key: 'SkullAGAnim',
		frames: scene.anims.generateFrameNumbers('Skull'),
		frameRate: 4,
		repeat: -1
	});

	generarSkull(obj);

	config = conf;
}

export function encenderTienda()
{
	if(textoSkull == false)
	{
		cuadroTexto = scene.add.rectangle(config.width / 2,config.height - 50, config.width, 100, 0xaaaaaa).setDepth(100).setScrollFactor(0);

		cuadroTexto2 = scene.add.rectangle(config.width / 2,config.height - 50, config.width - 8, 100 - 8, 0x000000).setDepth(101).setScrollFactor(0);

		scene.skullText = scene.add.text(16,210, 'Skull: Ayudadme a financiar el laborarorio!\nusad los numeros para comprar. \n1.pan = 15 Plorts\n2.pastel = 50 Plorts', {fontSize: '12px', fill: '#68FF00', fontFamily: 'sans-serif'}).setDepth(102).setScrollFactor(0);
	}

	textoSkull = true;
}

export function update()
{
	updateTexto();
}

function updateTexto()
{
	if(cuadroTexto != undefined)
	{

		if(Phaser.Geom.Intersects.RectangleToRectangle(heroes.cabeza.getBounds(), skull.detectionbox.getBounds()))
		{
			cuadroTexto.setAlpha(1)
			cuadroTexto2.setAlpha(1)
			scene.skullText.setAlpha(1)
			//imagenTexto.setAlpha(1)
		}
		else{
			cuadroTexto.setAlpha(0)
			cuadroTexto2.setAlpha(0)
			scene.skullText.setAlpha(0)
			//imagenTexto.setAlpha(0)
		}

	}
}

//#68FF00

export function generarSkull(obj)
{
	skull = scene.physics.add.staticSprite(obj.x, obj.y, 'skull').setDepth(5);
	skull.setSize(30, 39);
	skull.play('SkullAGAnim', true);

	skull.detectionbox = scene.add.rectangle(skull.x, skull.y, 180, 180);
	scene.physics.add.existing(skull.detectionbox, false);

	//skull.body.enable = false;
	//skull.detectionbox.body.enable = false;
	//skull.setAlpha(0);

	scene.physics.add.overlap(heroes.heroes, skull.detectionbox, encenderTienda, null, scene);

	scene.input.keyboard.on('keydown', (event) => {
		var c = event.code
		if( c.slice(0,5) == "Digit")
		{
			var numKey = c.toLowerCase().charAt(c.length-1)

			if(numKey == 1 && dinero.dinero >=15)
			{
				inventario.generarPan()
				dinero.incrementarPlorts(-15)
			}
			else if(numKey == 2 && dinero.dinero >=50)
			{
				inventario.generarTarta()
				dinero.incrementarPlorts(-50)

			}
		}
	})
}