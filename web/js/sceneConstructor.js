import lab from './mapas/lab.js'

export var config={
		type:Phaser.AUTO,
		width:400,
		height:300,
		pixelArt: true,
		fps: {
			target: 60,
			forceSetTimeOut: true
		},
		physics:{
			default:'arcade',
			arcade:{
				debug: false,
				gravity:{y:0}
			}
		},
		
		scale:{
			//mode: Phaser.Scale.FIT,
			parent: 'game',
			mode: Phaser.Scale.ENVELOPE,
        	//autoCenter: Phaser.Scale.CENTER_BOTH,
			//zoom: 2,
		},
		scene: [lab]

		//ificultad: 1
};

var game=new Phaser.Game(config);
//export 

//game.config.dificultad = 1;