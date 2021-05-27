var scene;

export function preload()
{
	this.load.spritesheet('cake', 'assets/images/strange_cake.png', {frameWidth:32, frameHeight:32});
	this.load.image('pan', 'assets/images/pan.png');
	this.load.image('inventario', 'assets/images/inventario.png');

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

export function generarInventario(obj)
{
	imagenTexto = scene.physics.add.sprite(yasha.player.x - config.width / 2 + config.width / 2, yasha.player.y - config.height / 2 + config.height - 50, config.width - 8, 'textoHielo').setDepth(18).setScale(2);
}

export function generarPan(obj)
{
	var e = grupoEnemigos.create(obj.x, obj.y, 'enemigoJotun').setDepth(5).setPipeline('Light2D');
	e.setScale(2);
	e.setCircle(22);
	e.play('lie', true);

	e.detectionbox = scene.add.rectangle(e.x, e.y, 290, 290);
	scene.physics.add.existing(e.detectionbox, false);

	e.detectionbox.tiempoDisparo = 0;

	scene.physics.add.overlap(heroes.heroes, e.detectionbox, disparoEnemigo, null, scene);
}

export function generarPan(obj)
{
	var e = grupoEnemigos.create(obj.x, obj.y, 'enemigoJotun').setDepth(5).setPipeline('Light2D');
	e.setScale(2);
	e.setCircle(22);
	e.play('lie', true);

	e.detectionbox = scene.add.rectangle(e.x, e.y, 290, 290);
	scene.physics.add.existing(e.detectionbox, false);

	e.detectionbox.tiempoDisparo = 0;

	scene.physics.add.overlap(heroes.heroes, e.detectionbox, disparoEnemigo, null, scene);
}

