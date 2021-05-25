import * as utilidades from './utilidades.js';

var portals = new Array();
var coolDown = 30
var scene
var tiempoActivo = 0;

export function preload()
{
	this.load.image('portalApagado','assets/images/portalApagado.png');
	this.load.spritesheet('portal','assets/images/portalAnim.png', { frameWidth: 32, frameHeight: 32});
	scene = this
}

export function createAnims()
{
	scene.anims.create({
		key: 'portalAnim',
		frames: scene.anims.generateFrameNumbers('portal'),
		frameRate: 1,

	});

}

export function create(capa)
{
	capa.forEach(obj => {
		if(obj.name == 'portal')
		{
			scene.physics.world.enable(obj);
			obj.setSize(4, 4)
			obj.body.height = 4
			obj.body.width = 4

			obj.body.offset.x += 14
			obj.body.offset.y += 14
			createPortal(obj);
		}
	})

	createLinks(scene)

	return portals
}

function createPortal(obj)
{
	utilidades.convertToProperties(obj)


	if(obj.type=="lab")
	{
    	obj.setAlpha(1)
		obj.setTexture('portal')
		console.log('un portal mas')
	}
	else
	{
		obj.setAlpha(0)
	}

	obj.coolDown = 0

	portals.unshift(obj)
}

export function collisionPortal(obj)
{
	scene.physics.add.overlap(obj, portals, teleport, teleportTimeout, scene);
	console.log('una colision creada')
}

function teleportTimeout()
{
	tiempoActivo++;

	if (tiempoActivo > 15)
	{
		tiempoActivo = 0
		return true
	}
	return true
}

function teleport(entity, obj)
{
	if (obj.coolDown <= 0 && tiempoActivo == 10)
	{
		obj.coolDown = coolDown
		obj.destino.coolDown = coolDown

		entity.x = obj.destino.x
		entity.y = obj.destino.y
		tiempoActivo = 0;
	}

	console.log('muevete')

}

function createLinks()
{
	for (var i = 0; i < portals.length; i++) {
		var p = portals[i]
		
		p.linked=false;
		for (var e = 0; e < portals.length; e++)
		{
			var d = portals[e]
			if(p.properties.destino == d.properties.puerta)
			{
				p.destino=d
				p.linked=true;
			}
		}
		if(!p.linked)
		{
			p.destino=p
		}
	}
	console.log('links hechos')
}

export function update()
{
	for (var i = 0; i < portals.length; i++){
		portals[i].coolDown--
		if(portals[i].coolDown <= 0 && portals[i].type=="lab")
		{
			portals[i].play('portalAnim', true)
		}
		else if(portals[i].type=="lab")
		{
			portals[i].play('portalAnim', false)
			portals[i].setTexture('portalApagado')
		}
	}
}