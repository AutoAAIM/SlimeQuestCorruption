import lab from './mapas/lab.js'
import swamp from './mapas/poisonSwamp.js'
import registrar from './menus/registrar.js'

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
		scene: [registrar, lab, swamp],
};

var game=new Phaser.Game(config);
//export 

game.usuario = undefined;