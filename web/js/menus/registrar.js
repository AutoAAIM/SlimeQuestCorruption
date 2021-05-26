import * as sc from '../sceneConstructor.js';
import * as utilidades from '../utilidades.js';

var scene
var sky
let keys = new Set();
var cuadroTexto
var playButton
var regButton

var nameTextInput = new String
var contTextInput = new String
var responseTextOutput = new String

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
		//this.load.image('sky','assets/images/fondo_menu.jpg');
		this.load.spritesheet('play','assets/images/play button.png', { frameWidth: 48, frameHeight: 32});
		this.load.spritesheet('regbut','assets/images/reg button.png', { frameWidth: 48, frameHeight: 32});
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
		scene.anims.create({
			key: 'regAnim',
			frames: scene.anims.generateFrameNumbers('regbut'),
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
			scene.loginusuario();
			//scene.scene.start('lab');
		});

		regButton = scene.physics.add.sprite(100, sc.config.height/2+30, 'regbut').setDepth(20);
		regButton.play('regAnim', true)
		regButton.setInteractive();

		regButton.on('pointerdown', function () {
			scene.nuevousuario();
			//scene.scene.start('lab');
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
		//console.log(scene.input.keyboard)

		scene.physics.world.enable(this.contText);
		this.contText.setInteractive();
		this.contText.on('pointerdown', function () {
			activeText = "cont"
		});

		this.responseText = scene.add.text(16, 270, '//', {fontSize: '16px', fill: '#68FF00', fontFamily: 'sans-serif'})
		//console.log(scene.input.keyboard)

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
		this.responseText.setText('//' + responseTextOutput);
	}

	loginusuario(){
		var xhr = new XMLHttpRequest();
		var url = 'https://SlimeQuestCorruption.autoaaim.repl.co/loguser.php';
		
		var myObj;
		var myZone;

		xhr.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200)
			{
				//console.log(this.responseText)
				myObj = JSON.parse(this.responseText);
				myObj = myObj[0];
				console.log(myObj);

				if(myObj.usuarios.nombre == nameTextInput && myObj.usuarios.contrasena == contTextInput)
				{
					scene.game.usuario = myObj.usuario;
					scene.scene.start(myObj.zonanombre);
				}
				else{
					//console.log('no coincide')
					responseTextOutput = 'no coincide'
				}
		}
		}
		//console.log(xhr)
		xhr.open("POST", "php/loguser.php?", true)
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded")
		xhr.send("nombre="+nameTextInput+"&contrasena="+contTextInput)
	}


	nuevousuario(){
		var xhr = new XMLHttpRequest();
		var url = 'https://SlimeQuestCorruption.autoaaim.repl.co/reguser.php';
		
		var myObj;
		var myZone;

		xhr.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200)
			{
				if(this.responseText != "")
				{
					responseTextOutput = 'se ha registrado con exito!! ahora dele a log in para entrar ☻'
				}
				else{
					responseTextOutput = 'este usuario ya existe'
				}
				//console.log(this)
			}
		}
		//console.log(xhr)
		xhr.open("POST", "php/reguser.php?", true)
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded")
		xhr.send("nombre="+nameTextInput+"&contrasena="+contTextInput)
	}
}

