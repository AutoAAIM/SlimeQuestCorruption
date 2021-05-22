import * as sc from '../sceneConstructor.js';
import * as utilidades from '../utilidades.js';

var scene
var sky
let keys = new Set();
var cuadroTexto
var playButton

var nameTextInput = new String
var contTextInput = new String

var activeText

var nameTextHitbox
var contTextHitbox

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
			scene.nuevousuario();
			scene.savedatabase();
			scene.scene.start('lab');
		});

		//this.nameInput = utilidades.createTextInput(scene).setDepth(1);
		//console.log(this.nameInput)
    	this.nameText = scene.add.text(16, 210, 'Nombre: >' + nameTextInput +'<', {fontSize: '16px', fill: '#68FF00', fontFamily: 'sans-serif'})
		console.log(scene.input.keyboard)

		scene.physics.world.enable(this.nameText);
		this.nameText.setInteractive();
		this.nameText.on('pointerdown', function () {
			activeText = "name"
		});

		this.contText = scene.add.text(16, 240, 'Contraseña: >' + nameTextInput +'<', {fontSize: '16px', fill: '#68FF00', fontFamily: 'sans-serif'})
		console.log(scene.input.keyboard)

		scene.physics.world.enable(this.contText);
		this.contText.setInteractive();
		this.contText.on('pointerdown', function () {
			activeText = "cont"
		});

    	this.input.keyboard.on('keydown', (event) => {
			var c = event.code
			console.log(c)
			if(activeText == "name")
			{
				if(c.slice(0,3) == "Key" || c.slice(0,5) == "Digit")
				{
					nameTextInput += c.toLowerCase().charAt(c.length-1)
				}
				else if(c == "Space")
				{
					nameTextInput += ' '
				}
				else if(c == "Backspace" )
				{
					nameTextInput = nameTextInput.slice(0,nameTextInput.length-1)
				}
			}

    	})

		this.input.keyboard.on('keydown', (event) => {
			var c = event.code
			if(activeText == "cont")
			{
				if(c.slice(0,3) == "Key" || c.slice(0,5) == "Digit")
				{
					contTextInput += c.toLowerCase().charAt(c.length-1)
				}
				else if(c == "Space")
				{
					contTextInput += ' '
				}
				else if(c == "Backspace" )
				{
					contTextInput = contTextInput.slice(0,contTextInput.length-1)
				}
			}

    	})
  
    //this.input.keyboard.on('keydown', callback, context);

	}

	update(time, delta)
	{
		//console.log(scene.input.keyboard)
    
		//nameTextInput = scene.input.keyboard._events;
		sky.tilePositionX+=2;

		this.nameText.setText('Nombre: >' + nameTextInput +'<');
		this.contText.setText('Contraseña: >' + contTextInput +'<');
	}

	nuevousuario(){
		var user = 'usuario';
		var pass = 'password';
		var urlllamada = 'https://SlimeQuestCorruption.autoaaim.repl.co/web/php/newuser.php';

		var xhr = new XMLHttpRequest();

		xhr.open('POST', urlllamada);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

		// Acciones a procesar tras recibir la respuesta
		xhr.onload = function() {
			if (xhr.status === 200) {
				console.log('Respuesta recibida: ' + xhr.responseText);
			}
			else if (xhr.status !== 200) {
				console.log('Algo ha fallado: ' + xhr.status);
			}
		};
		// Envia datos al servidor php
		var datos = 'user=' + user + '&pass=' + pass;
		// Debug
		var datoscodificados = encodeURI(datos);
		console.log(datoscodificados);
		xhr.send(datoscodificados);
	}

	savedatabase() {
		var secret = 'mi contra senya';
		var usuario = 'usuario@';
		var funcion = 'guardar';
		//var contador = counter.toString();
		//var contadormax = maxcounter.toString();
		var urlllamada = 'https://SlimeQuestCorruption.autoaaim.repl.co/web/php/index.php';

		var xhr = new XMLHttpRequest();

		xhr.open('POST', urlllamada);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

		// Acciones a procesar tras recibir la respuesta
		xhr.onload = function() {
			if (xhr.status === 200) {
				console.log('Respuesta recibida: ' + xhr.responseText);
			}
			else if (xhr.status !== 200) {
				console.log('Algo ha fallado: ' + xhr.status);
			}
		};
		// Envia datos al servidor php
		var datos = 'secret=' + secret + '&usuario=' + usuario/* + '&funcion=' + funcion + '&contador=' + contador + '&contadormax=' + contadormax*/;
		// Debug
		console.log(datos);
		var datoscodificados = encodeURI(datos);
		console.log(datoscodificados);
		xhr.send(datoscodificados);
	}
}