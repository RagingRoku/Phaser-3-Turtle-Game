// Step 1: define game configuration
let config = {
    type: Phaser.WEBGL,
    width: 800, 
    height: 600,
    physics: {
        default: "arcade"
    }, 
    scene: {
        preload: preloadCode,
        create: initCode,
        update: updateCode
    }
};

// Step 2: make a new phaser game object and pass the config properties
let game = new Phaser.Game(config);

// Step 3: define globals
let player, cups, arrows;
let cupWalls = [];



// Step 4: required functions to preload, create, update
function preloadCode(){

    /* args:
    String: nickname/key for asset to access
    String: path for asset
    Object: frame width, height (in px) 
            representing the dimensions of a single frame of the spritesheet
    */

    this.load.spritesheet('turtle',
    'assets/turtle.png',
    { frameWidth: 32, frameHeight: 32 }
    );
    this.load.image('ocean', 'assets/ocean.png')
    this.load.image('cup', 'assets/trashCup.png')

}
function initCode(){
    // set background
    this.add.image(400,300,'ocean').setScale(2.5, 3.4); // setScale(scaleX, scaleY)

    // create turtle using the asset
    player = this.physics.add.sprite(400,500,'turtle').setScale(2);


    // make static physics group for cups

    for (let i = 0; i < 10 ; i++){
      cupWalls[i] = this.physics.add.staticGroup({
        key: 'cup',
        repeat: 5,
        setXY: { x: (120*i), y: (50*i), stepY: 200 }
    });

    // player can collide with cups
    this.physics.add.collider(player, cupWalls[i])
    }
/*
    cups = this.physics.add.staticGroup({
        key: 'cup',
        repeat: 7,
        setXY: { x: 120, y: 0, stepY: 150 }
    });
*/


    // turtle can collide with world bounds
    player.setCollideWorldBounds(true);

    // player can collide with cups
//    this.physics.add.collider(player, cups)


    // monitor the arrow keys during the update loop
    arrows =  this.input.keyboard.createCursorKeys();



    /* animation for movement */
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('turtle', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('turtle', { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1
    });



}
function updateCode(){

    /* hangle arrows input */
    if (arrows.left.isDown){
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (arrows.right.isDown){
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else{
        player.setVelocityX(0);
    }

    // different else if block for up and down so that diagonal movement is possible (LR not exclusive of UD)
    if (arrows.up.isDown){
        player.setVelocityY(-160);
    }
    else if ( arrows.down.isDown ) {
       player.setVelocityY( 160 );
    }
    else{
        player.setVelocityY(0);
    }

    // stop animation if nothing is pressed
    if( arrows.down.isUp &&
        arrows.up.isUp   &&
        arrows.left.isUp &&
        arrows.right.isUp
        ){
            player.anims.stop();
        }
    

}