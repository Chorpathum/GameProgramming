
import Phaser from '../lib/phaser.js'

export default class GameScene extends Phaser.Scene{
    constructor() {
        super("game");	
    }     
    load_dragonbone(key,name){
        this.load.dragonbone(
            key,
            "assets/dragonbone/"+name+"_tex.png",
            "assets/dragonbone/"+name+"_tex.json",
            "assets/dragonbone/"+name+"_ske.dbbin",
            null,
            null,
            { responseType: "arraybuffer" }
        );  
    }
    preload(){
        this.load_dragonbone("cat1","NewProject");
        this.load.audio("hello","assets/audio/Hello.mp3");
    }
    
    create ()
    {
       
        const width = this.scale.width;
        const height = this.scale.height;

        this.add.text(width/2,10,"Dragon Bone",{fontSize: 32,fontFamily: 'Black Ops One',color:'#FF0'}).setOrigin(0.5,0)

        this.add.text(width/2,height-30,"กดปุ่ม ESC เพื่อกลับ",{fontSize: 16,fontFamily: 'Bai Jamjuree'})
                .setOrigin(0.5,0)
        this.input.keyboard.on('keydown-ESC',function(){ 
            this.scene.start("menu");             
        }, this);             
        this.cameras.main.setDeadzone(width * 0.5, height * 0.5) ;

        this.cat1 = this.add.armature("cat1", "cat1");
        this.cat1.scale = 0.5;
        //console.log(this.dragon);
        //console.log(this.dragon.animation.animationNames);        
        this.cat1.animation.play("walk",4);
        this.cat1.x = -1;
        this.cat1.y = 400;
        /*this.cat.addDBEventListener(dragonBones.EventObject.START, this._animationStart, this);
        this.cat.addDBEventListener(dragonBones.EventObject.COMPLETE, this._animationComplete, this);
        this.input.on('pointerdown', () => {
           this.cat.animation.play("jump",1);
        });*/
        var t = this.add.tween({
          targets: this.cat1,
          duration : 1800,
          x:{ from:-1, to: width/2}
        });

        this.time.delayedCall(2500,()=> this.cat1.animation.fadeIn("stand",0.5,2))
        this.time.delayedCall(2500,()=> this.sound.play("hello"))
        this.time.delayedCall(3800,()=> this.cat1.animation.fadeIn("jump",0.5,1))
        this.time.delayedCall(5000,()=> this.cat1.animation.fadeIn("stand",0.5,3))

    }   
    /*_animationStart(event){
        if (event.animationState.name === "jump") {
            this.sound.play("swasdee");
        }    
    }
    _animationComplete(event){
        if (event.animationState.name === "walk") {
            this.cat.animation.fadeIn("stand", 0.5,1);
        }
        if (event.animationState.name === "stand") {
            this.cat.animation.fadeIn("jump", 0.5,1);
        }
        if (event.animationState.name === "jump") {
            this.cat.animation.fadeIn("stand", 0.5);
        }
    }  */   

    update () {
       
    }  
    
}