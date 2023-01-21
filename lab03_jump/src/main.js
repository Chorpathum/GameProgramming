import Phaser from './lib/phaser.js'

import Game from './scenes/Game.js'
import GameOver from './scenes/GameOver.js'
import Start from './scenes/Start.js'


export default new Phaser.Game({
	type: Phaser.AUTO,
	width: 480,
	height: 620,
	scene: [Start , Game, GameOver],
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {
				y: 200
			},
			debug: false
		}
	},scale:{
		autoCenter: Phaser.Scale.CENTER_BOTH,
	}
})