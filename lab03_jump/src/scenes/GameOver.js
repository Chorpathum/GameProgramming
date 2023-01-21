import Phaser from '../lib/phaser.js'

export default class GameOver extends Phaser.Scene {
    constructor() {
        super('game-over')
    }
    preload(){
        this.load.image('gameover', 'assets/g1.png')
        this.load.audio('Sg', 'assets/gameover.mp3')
    }

    create() {
        this.add.image(240,310,'gameover')
        this.sound.play('Sg')
        const width = this.scale.width
        const height = this.scale.height

        this.add.text(240,600, 'กด space เล่นใหม่', {
            fontSize: 16
        }).setScrollFactor(0)
        .setOrigin(0.5, 0)

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('game')
        })
                    
    }
}
