var scene;
export var grupoCake;
export var grupoPan;

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

	generarInventario(obj);
	generarPan(obj);
	generarPan(obj);
}

export function generarInventario(obj)
{
	imagenInventario = scene.physics.add.sprite(yasha.player.x - config.width / 2 + config.width / 2, yasha.player.y - config.height / 2 + config.height - 50, config.width - 8, 'inventario').setDepth(18);
}

export function generarPan(obj)
{
	pan1 = scene.physics.add.sprite(yasha.player.x - config.width / 2 + config.width / 2, yasha.player.y - config.height / 2 + config.height - 50, config.width - 8, 'pan').setDepth(20);
}

export function generarTarta(obj)
{
	tarta2 = grupo.create(spawn.x,spawn.y, 'tarta').setDepth(20);
	tarta2.play('lie', true);
}

