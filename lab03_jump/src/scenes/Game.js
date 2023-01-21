import Phaser from '../lib/phaser.js'

import Carrot from '../game/Carrot.js'

export default class Game extends Phaser.Scene {

    carrotsCollected = 0
    
    constructor() {
        super('game')
    }
    

    preload() {
        this.load.image('background','assets/b3.png');
        this.load.image('platform','assets/cloud.png');
        this.load.image('foxy-stand', 'assets/foxy1.png');
        this.load.image('carrot', 'assets/star.png')
        this.load.image('foxy-jump', 'assets/foxy3.png')
        this.load.image('foxy-right', 'assets/foxy2.png')

        this.load.audio('jump', 'assets/jump.mp3')
        this.load.audio('Sgem', 'assets/s_coin.mp3')

 
        this.cursors = this.input.keyboard.createCursorKeys()
    }
    create() {
        this.add.image(240,310,'background').setScrollFactor(1, 0)

        //platforml
        //this.add.image(190,80,'platform'.setScale(0.5));
        //this.physics.add.image(240, 320, 'platform') .setScale(0.5);
        
        this.platforms = this.physics.add.staticGroup()
        

        // then create 5 platforms from the group
        for (let i = 0; i < 9; ++i) {
            const x = Phaser.Math.Between(80, 400)
            const y = 80* i

            // use this.platforms here as well
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = this.platforms.create(x, y, 'platform')
            platform.scale = 0.2
            platform.xv = 1;


            /** @type {Phaser.Physics.Arcade.StaticBody} */
            const body = platform.body
            body.updateFromGameObject()

        }

        //character 
        //this.physics.add.sprite(240, 320, 'foxy-stand').setScale(0.5)
        
        this.player = this.physics.add.sprite(240, 320, 'foxy-stand').setScale(0.15)

        this.physics.add.collider(this.platforms, this.player)

        this.player.body.checkCollision.up = false
        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false
      
        this.cameras.main.startFollow(this.player)
        this.cameras.main.setDeadzone(this.scale.width * 1.5,this.scale.height*0.5)

        // create a carrot
        this.carrots = this.physics.add.group({
            classType: Carrot
        })
        this.carrots.get(240, 320, 'carrot')
        // add this collider
        this.physics.add.collider(this.platforms, this.carrots)
        // formatted this way to make it easier to read
        this.physics.add.overlap(
            this.player,
            this.carrots,
            this.handleCollectCarrot, // called on overlap
            undefined,
            this
        )

        const style = { color: '#000', fontSize: 24 }
        this.carrotsCollectedText = this.add.text(240, 10, 'Star: 0'
            , style)
            .setScrollFactor(0)
            .setOrigin(0.5, 0)

    }

    update(t, dt) {

        
        this.platforms.children.iterate(child => {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = child
            platform.x += platform.xv
            if(platform.x > 400) {platform.xv = -1}
            if (platform.x < 0){platform.xv = 1}
            platform.refreshBody()
            const scrollY = this.cameras.main.scrollY
            if (platform.y >= scrollY + 700) {
                platform.y = scrollY - Phaser.Math.Between(50, 95)
                platform.x = Phaser.Math.Between(80, 400)
                platform.body.updateFromGameObject()

                // create a carrot above the platform being reused
                this.addCarrotAbove(platform)
            }

        })
            
        // find out from Arcade Physics if the player's physics body
        // is touching something below it
        const touchingDown = this.player.body.touching.down

        if (touchingDown) {
            // this makes the foxy jump straight up
            this.player.setVelocityY(-300)

            this.player.setTexture('foxy-right')
            // play jump sound
            this.sound.play('jump')
            

        }

        const vy = this.player.body.velocity.y
        if (vy > 0 && this.player.texture.key !== 'foxy-stand') {
            // switch back to jump when falling
            this.player.setTexture('foxy-stand')
        }

        // left and right input logic
        if (this.cursors.left.isDown && !touchingDown) {
            this.player.setVelocityX(-200)
            this.player.setTexture('foxy-jump')
        }
        else if (this.cursors.right.isDown && !touchingDown) {
            this.player.setVelocityX(200)   
            this.player.setTexture('foxy-right')
        }
        else {
            // stop movement if not left or right
            this.player.setVelocityX(0)
        }

        this.horizontalWrap(this.player)

        const bottomPlatform = this.findBottomMostPlatform()
        if (this.player.y > bottomPlatform.y + 200) {
            this.scene.start('game-over')
        }

    }
    /**
     * @param {Phaser.GameObjects.Sprite} sprite
     */
    horizontalWrap(sprite) {
        const halfWidth = sprite.displayWidth * 0.5
        const gameWidth = this.scale.width
        if (sprite.x < -halfWidth) {
            sprite.x = gameWidth + halfWidth
        }
        else if (sprite.x > gameWidth + halfWidth) {
            sprite.x = -halfWidth
        }
    }

    addCarrotAbove(sprite) {
        const y = sprite.y - sprite.displayHeight -10

        /** @type {Phaser.Physics.Arcade.Sprite} */
        const carrot = this.carrots.get(sprite.x, y, 'carrot')

        // set active and visible
        carrot.setActive(true)
        carrot.setVisible(true)

        
        
        this.add.existing(carrot)

        carrot.body.setSize(carrot.width, carrot.height)

        

        // make sure body is enabed in the physics world
        this.physics.world.enable(carrot)
        
        return carrot
    }

    handleCollectCarrot(player, carrot) {
        this.carrots.killAndHide(carrot)

        this.physics.world.disableBody(carrot.body)

        const value = `Star: ${this.carrotsCollected}`

        

        // increment by 1
        this.carrotsCollected++
        this.sound.play('Sgem')

        // create new text value and set it
        this.carrotsCollectedText.text = value
    }

    findBottomMostPlatform() {
        const platforms = this.platforms.getChildren()
        let bottomPlatform = platforms[0]

        for (let i = 1; i < platforms.length; ++i) {
            const platform = platforms[i]

            // discard any platforms that are above current
            if (platform.y < bottomPlatform.y) {
                continue
            }

            bottomPlatform = platform
        }

        return bottomPlatform
    }

    init() {
        this.carrotsCollected = 0
    }



 
}