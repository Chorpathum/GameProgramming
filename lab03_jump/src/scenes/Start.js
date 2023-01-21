import Phaser from '../lib/phaser.js'

export default class Start extends Phaser.Scene {
    constructor() {
        super('start')
    }

    preload(){
        this.load.image('Start','assets/s2.png');
    }
    
    create() {
        this.add.image(240,310,'Start')
        const width = this.scale.width
        const height = this.scale.height

        this.add.text(240,600, '633020388-5', {
            fontSize: 16
        }).setScrollFactor(0)
        .setOrigin(0.5, 0)

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('game')
        })
                    
    }
}
