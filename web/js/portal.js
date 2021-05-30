import * as utilidades from './utilidades.js';
import * as inventario from './inventario.js'

var portals = new Array();
var coolDown = 30
var scene
var tiempoActivo = 0;
var sceneChanged;
var musica;

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

export function create(capa, music)
{
	musica = music;
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

	sceneChanged = false;

	createLinks(scene)

	return portals
}

function createPortal(obj)
{
	utilidades.convertToProperties(obj)

	//console.log(obj)


	if(obj.properties.tipo=="lab")
	{
    	obj.setAlpha(1)
		obj.setTexture('portal')
		//console.log('un portal mas')
	}
	else if(obj.properties.tipo=="interScene")
	{
		obj.setAlpha(1)
		obj.setTexture('portal')
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
	//console.log('una colision creada')
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

function teleport(obj, entity)
{
	if (obj.coolDown <= 0 && tiempoActivo == 10)
	{
		obj.coolDown = coolDown
		obj.destino.coolDown = coolDown

		entity.x = obj.destino.x
		entity.y = obj.destino.y
		tiempoActivo = 0;
	}
	if(obj.properties.tipo=="interScene")
	{
		changeScene(obj);
	}

	//console.log('muevete de '+obj+' a '+obj.destino)

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

function changeScene(obj)
{
	if(sceneChanged == false)
	{
		if(musica != undefined)
		{
			musica.stop();
		}
		sceneChanged = true;
		var xhr = new XMLHttpRequest();
		//var url = 'https://SlimeQuestCorruption.autoaaim.repl.co/reguser.php';
		
		//obj.properties.destino

		var myObj = scene.game.usuario;

		xhr.onreadystatechange = function(){
			console.log(this.responseText)
			myObj = JSON.parse(this.responseText);
			myObj = myObj[0];
			if(this.readyState == 4 && this.status == 200)
			{
				scene.game.usuario = myObj;
				//alert(xhr.responseText);
				//scene.scene.stop(scene);
				scene.scene.start(myObj.zonanombre);

			}
		}
		
		for(var i = 0; i < 4; i++)
        {
            if(inventario.grupoObjetos.getChildren()[i] == undefined){
				inventario.grupoObjetos.getChildren()[i] = new Object;
                inventario.grupoObjetos.getChildren()[i].name = null;
            }
        }
		console.log(obj.properties.destino)
		console.log(myObj.nombre)
		xhr.open("POST", "php/guardar.php", true)
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded")
		xhr.send("nombre="+myObj.nombre+"&contrasena="+myObj.contrasena+"&dinero="+myObj.dinero+"&zona="+obj.properties.destino+"&inventario1="+inventario.grupoObjetos.getChildren()[0].name+"&inventario2="+inventario.grupoObjetos.getChildren()[1].name+"&inventario3="+inventario.grupoObjetos.getChildren()[2].name+"&inventario4="+inventario.grupoObjetos.getChildren()[3].name)
	}
}