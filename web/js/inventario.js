var scene;

export function preload()
{
	this.load.spritesheet('cake', 'assets/images/strange_cake.png', {frameWidth:32, frameHeight:32});
	this.load.image('pan', 'assets/images/pan.png');

	scene = this;
}

export function create(obj)
{
	grupoPan = scene.physics.add.staticGroup();
	grupoCake = scene.physics.add.staticGroup();

	scene.anims.create({
			key:'lie',
			frames: scene.anims.generateFrameNames('cake'),
			frameRate: 4,
			repeat: -1
		});
}

export function generarEnemigo(obj)
{
	var e = grupoEnemigos.create(obj.x, obj.y, 'enemigoJotun').setDepth(5).setPipeline('Light2D');
	e.setScale(2);
	e.setCircle(22);
	e.play('slime', true);

	e.detectionbox = scene.add.rectangle(e.x, e.y, 290, 290);
	scene.physics.add.existing(e.detectionbox, false);

	e.detectionbox.tiempoDisparo = 0;

	scene.physics.add.overlap(heroes.heroes, e.detectionbox, disparoEnemigo, null, scene);
}

function disparoEnemigo(en,py)
{
	if(en.tiempoDisparo <= 0)
	{
		en.tiempoDisparo = 15;

		var d = grupoDispEnemigo.create(en.x - 15, en.y + 5, 'polvoHielo').setDepth(5).setPipeline('Light2D');

	 	d.setAlpha(0.3);

	 	var separar = Phaser.Math.Between(-50, 50)

	 	scene.physics.moveTo(d, heroes.cabeza.x + separar, heroes.cabeza.y + separar, 50);

		d.tiempoVida = 320;
	}

	en.tiempoDisparo--;
}

export function updateDispEnem()
{
	Phaser.Actions.Call(grupoDispEnemigo.getChildren(),function(d)
	{
		d.tiempoVida--;
		if(d.tiempoVida <= 0)
		{
			d.destroy();
		}
	});
}

export function quitarVida()
{
	// yasha.vida--;
}