WhackaMole.Game = function(game) {
    this.totalBunnies;
    this.bunnyGroup;
    this.totalSpacerocks;
    this.moleholegroup;
    this.totalSpacemoles
    this.spacerockgroup;
    this.spacemolegroup;
    this.burst;
    this.gameover;
    this.countdown;
    this.overmessage;
    this.secondsElapsed;
    this.timer;
    this.music;
    this.ouch;
    this.boom;
    this.ding;
    this.molegroup;
    this.hole;
    this.totalMoles;
    this.crosshair;
    this.currentSpeed;
    this.emitter;
    this.molesWhacked;
    this.pausedText;

};




WhackaMole.Game.prototype = {

    create: function() {

        socket = io.connect();

        this.gameover = false;
        this.secondsElapsed = 0;
        this.timer = this.time.create(false);
        this.timer.loop(1000, this.updateSeconds, this);
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.music = this.add.audio('game_audio');
        this.music.play('', 0, 0.3, true);
        this.ouch = this.add.audio('hurt_audio');
        this.boom = this.add.audio('explosion_audio');
        this.ding = this.add.audio('select_audio');
        this.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
        this.currentSpeed = 0;
        this.totalSpacemoles = 30;
        this.molesWhacked = 0;


        this.buildWorld();
        this.makeItRain();


    },

    updateSeconds: function() {
        this.secondsElapsed++;

    },

    buildWorld: function() {
        this.add.image(0, 0, 'sky');
        this.add.image(0, 0, 'stars');
        this.add.image(0, 0, 'land');
        this.add.image(40, 40, 'sun');

        this.buildMoleHoles();
        this.molesInit();
        this.buildSpaceMoles();


        this.crosshair = this.add.sprite(this.world.centerX,this.world.centerY, 'crosshair');
        this.crosshair.anchor.setTo(0.5,0.5);
        this.physics.arcade.enable(this.crosshair);
        this.crosshair.collideWorldBounds = true;
        this.crosshair.body.maxVelocity.setTo(400, 400);
        this.crosshair.body.collideWorldBounds = true;


        //this.buildBunnies();
        //this.buildSpaceRocks();
        //this.time.events.repeat(Phaser.Timer.SECOND * .5, 100, this.buildSpaceMoles, this);
        this.buildEmitter();
        this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Moles Whacked ' + this.molesWhacked, 20);
        this.timer.start();
    },

    buildMoles: function(x,y){
        var that = this;
        var newMole = this.molegroup.create(x,y, 'mole');
        newMole.anchor.setTo(0.5, 0.5);
        this.physics.enable(newMole, Phaser.Physics.ARCADE);
        newMole.enableBody = true;
        newMole.animations.add('Up',[1,2,3,4,5,6,5,6,5,6,6,5,4,3,2,1,0,0,0,0,0,0]);
        newMole.animations.add('Down',[6,5,4,3,2,1,0]);
        var random = that.rnd.integerInRange(1, 25);
        newMole.animations.play('Up', random, true);
        //var mA1 = this.molegroup.create(87, 440, 'mole');
        //var mA2 = this.molegroup.create(87, 660, 'mole');
        //var mB1 = this.molegroup.create(273, 370, 'mole');
        //var mB2 = this.molegroup.create(273, 540, 'mole');
        //var mB3 = this.molegroup.create(273, 775, 'mole');
        //var mC1 = this.molegroup.create(450, 440, 'mole');
        //var mC2 = this.molegroup.create(450, 660, 'mole');
        //this.molegroup.forEach(function(mole) {
        //    mole.anchor.setTo(0.5, 0.5);
        //    that.physics.enable(mole, Phaser.Physics.ARCADE);
        //    mole.enableBody = true;
        //    mole.animations.add('Up',[1,2,3,4,5,6,5,6,5,6,6,5,4,3,2,1,0,0,0,0,0,0]);
        //    mole.animations.add('Down',[6,5,4,3,2,1,0]);
        //    var random = that.rnd.integerInRange(1, 25);
        //    mole.animations.play('Up', random, true)
        //});

    },

    molesInit: function() {
        this.molegroup = this.add.group();
        this.molegroup.enablebody = true;
        this.buildMoles(87,440);
        this.buildMoles(87,640);
        this.buildMoles(273,370);
        this.buildMoles(273,540);
        this.buildMoles(273,775);
        this.buildMoles(450,440);
        this.buildMoles(450,660);

    },

    moleloop: function(m, num){
        m.animations.play('Up',num, true);
    },

    buildMoleHoles: function(){
        this.moleholegroup = this.add.group();
        this.moleholegroup.enablebody = true;
        var mhA1 = this.moleholegroup.create(90,500, 'molehole');
        var mhA2 =this.moleholegroup.create(90, 715, 'molehole');
        var mhB1 = this.moleholegroup.create(270,430, 'molehole');
        var mhB2 = this.moleholegroup.create(270,590, 'molehole');
        var mhB3 = this.moleholegroup.create(270,806, 'molehole');
        var mhC1 = this.moleholegroup.create(455,500, 'molehole');
        var mhC2 = this.moleholegroup.create(455,715, 'molehole');
        this.moleholegroup.forEach(function(molehole){
            molehole.anchor.setTo(0.5, 0.5);
        });
    },

    makeItRain: function() {
        this.emitter = this.add.emitter(this.world.centerX, 0, 400);

        this.emitter.width = this.world.width;
        // emitter.angle = 30; // uncomment to set an angle for the rain.

        this.emitter.makeParticles('stars');

        this.emitter.minParticleScale = 0.1;
        this.emitter.maxParticleScale = 0.5;

        this.emitter.setYSpeed(300, 500);
        this.emitter.setXSpeed(-5, 5);

        this.emitter.minRotation = 0;
        this.emitter.maxRotation = 0;

        this.emitter.start(false, 1600, 5, 0);


    },

    paused: function () {

        if (this.pausedText)
        {
            this.pausedText.visible = true;
        }
        else
        {
            this.pausedText = this.add.bitmapText(this.world.centerX-100, this.world.centerY, 'eightbitwonder', 'PAUSED', 40);

            this.stage.addChild(this.pausedText);
        }

    },

    resumed: function () {

        this.pausedText.visible = false;

    },

    //buildBunnies: function() {
    //    this.bunnygroup = this.add.group();
    //    this.bunnygroup.enableBody = true;
    //    for(var i=0; i<this.totalBunnies; i++) {
    //        var b = this.bunnygroup.create(this.rnd.integerInRange(-10, this.world.width-50), this.rnd.integerInRange(this.world.height-180, this.world.height-60), 'bunny', 'Bunny0000');
    //        b.anchor.setTo(0.5, 0.5);
    //        b.body.moves = false;
    //        b.animations.add('Rest', this.game.math.numberArray(1,58));
    //        b.animations.add('Walk', this.game.math.numberArray(68,107));
    //        b.animations.play('Rest', 24, true);
    //        this.assignBunnyMovement(b);
    //    }
    //},



    //assignBunnyMovement: function(b) {
    //    bposition = Math.floor(this.rnd.realInRange(50, this.world.width-50));
    //    bdelay = this.rnd.integerInRange(2000, 6000);
    //    if(bposition < b.x){
    //        b.scale.x = 1;
    //    }else{
    //        b.scale.x = -1;
    //    }
    //    t = this.add.tween(b).to({x:bposition}, 3500, Phaser.Easing.Quadratic.InOut, true, bdelay);
    //    t.onStart.add(this.startBunny, this);
    //    t.onComplete.add(this.stopBunny, this);
    //},

    //startBunny: function(b) {
    //    b.animations.stop('Rest');
    //    b.animations.play('Walk', 24, true);
    //},


    stopBunny: function(b) {
        b.animations.stop('Walk');
        b.animations.play('Rest', 24, true);
        this.assignBunnyMovement(b);
    },

    stopMole: function(m) {
        m.animations.stop('up');
        m.animations.play('down');
    },

    //buildSpaceRocks: function() {
    //    this.spacerockgroup = this.add.group();
    //    for(var i=0; i<this.totalSpacerocks; i++) {
    //        var r = this.spacerockgroup.create(this.rnd.integerInRange(0, this.world.width), this.rnd.realInRange(-1500, 0), 'spacerock', 'SpaceRock0000');
    //        var scale = this.rnd.realInRange(0.3, 1.0);
    //        r.scale.x = scale;
    //        r.scale.y = scale;
    //        this.physics.enable(r, Phaser.Physics.ARCADE);
    //        r.enableBody = true;
    //        r.body.velocity.y = this.rnd.integerInRange(200, 400);
    //        r.animations.add('Fall');
    //        r.animations.play('Fall', 24, true);
    //        r.checkWorldBounds = true;
    //        r.events.onOutOfBounds.add(this.resetRock, this);
    //    }
    //},

    buildSpaceMoles: function() {
        this.spacemolegroup = this.add.group();
        var sm_x = 10;
        var sm_y = 210;
        for(var i = 0; i < 3; i++){
            var sm = this.spacemolegroup.create(sm_x, sm_y, 'spacemole');
            this.physics.enable(sm, Phaser.Physics.ARCADE);
            sm.enableBody = true;
            sm.checkWorldBounds = true;
            sm.pivot.x += 5;
            sm_x = sm_x + 180;
            sm_y = sm_y - 100;
            console.log("Came through here")

        }

    },




    resetSpacemole: function(sm) {
        if(sm.y > this.world.height || sm.x > this.world.width) {
            this.respawnSpacemole(sm);
        }
    },

    respawnSpacemole: function(sm) {
        if(this.gameover == false){
            sm.reset(this.rnd.integerInRange(-100, 0), this.rnd.realInRange(20, this.world.height));
            sm.body.velocity.x = this.rnd.integerInRange(100, 300);
            sm.body.velocity.y = this.rnd.integerInRange(200, 400);
        }
    },





    //resetRock: function(r) {
    //    if(r.y > this.world.height) {
    //        this.respawnRock(r);
    //    }
    //},
    //
    //respawnRock: function(r) {
    //    if(this.gameover == false){
    //        r.reset(this.rnd.integerInRange(0, this.world.width), this.rnd.realInRange(-1500, 0));
    //        r.body.velocity.y = this.rnd.integerInRange(200, 400);
    //    }
    //},

    buildEmitter:function() {
        this.burst = this.add.emitter(0, 0, 80);
        this.burst.minParticleScale = 0.3;
        this.burst.maxParticleScale = 1.2;
        this.burst.minParticleSpeed.setTo(-30, 30);
        this.burst.maxParticleSpeed.setTo(30, -30);
        this.burst.makeParticles('explosion');
        this.input.onDown.add(this.fireBurst, this);
    },

    fireBurst: function(pointer) {
        if(this.gameover == false){
            this.boom.play();
            this.boom.volume = 0.2;
            this.burst.emitX = pointer.x;
            this.burst.emitY = pointer.y;
            this.burst.start(true, 5000, null, 20);
        }
    },

    burstCollision: function(r, b) {
        this.respawnRock(r);
    },

    bunnyCollision: function(r, b) {
        if(b.exists){
            this.ouch.play();
            this.respawnRock(r);
            this.makeGhost(b);
            b.kill();
            this.totalBunnies--;
            this.checkBunniesLeft();
        }
    },

    spacemoleCollision: function(sm) {
        if(sm.exists){
            this.ouch.play();
            //this.respawnSpacemole(sm);
            //add explostion
            sm.kill();
            this.molesWhacked += 1;
            this.countdown.setText('Moles Whacked ' + this.molesWhacked)
        }
    },

    moleCollision: function(m) {
        console.log('got into collision')
        if(m.exists){
            this.ouch.play();
            this.respawnMole(m);
            //add explostion
            m.kill();
            this.molesWhacked += 1;
            this.countdown.setText('Moles Whacked ' + this.molesWhacked)
        }
    },

    respawnMole: function(m){
        that = this;
        if(this.gameover == false){
            this.time.events.add(Phaser.Timer.SECOND * 5, function() {
                that.buildMoles(m.x, m.y);
                console.log('it happened');
            })
        }

    },




    //checkBunniesLeft: function() {
    //    if(this.totalBunnies <= 0){
    //        this.gameover = true;
    //        this.music.stop();
    //        this.countdown.setText('Bunnies Left 0');
    //        this.overmessage = this.add.bitmapText(this.world.centerX-180, this.world.centerY-40, 'eightbitwonder', 'GAME OVER\n\n' + this.secondsElapsed, 42);
    //        this.overmessage.align = "center";
    //        this.overmessage.inputEnabled = true;
    //        this.overmessage.events.onInputDown.addOnce(this.quitGame, this);
    //    }else {
    //        this.countdown.setText('Bunnies Left ' + this.totalBunnies);
    //    }
    //},

    //quitGame:function(pointer) {
    //    this.ding.play();
    //    this.state.start('StartMenu');
    //},

    //friendlyFire: function(b, e){
    //    if(b.exists){
    //        this.ouch.play();
    //        this.makeGhost(b);
    //        b.kill();
    //        this.totalBunnies--;
    //        this.checkBunniesLeft();
    //    }
    //},

    //makeGhost: function(b) {
    //    bunnyghost = this.add.sprite(b.x-20, b.y-180, 'ghost');
    //    bunnyghost.anchor.setTo(0.5, 0.5);
    //    bunnyghost.scale.x = b.scale.x;
    //    this.physics.enable(bunnyghost, Phaser.Physics.ARCADE);
    //    bunnyghost.enableBody = true;
    //    bunnyghost.checkWorldBounds = true;
    //    bunnyghost.body.velocity.y = -800;
    //},



    update: function() {

        var that = this;


        if (this.cursors.left.isDown) {
            this.crosshair.body.velocity.x = -200;
        }
        else if (this.cursors.right.isDown) {
            this.crosshair.body.velocity.x = 200;
        } else {this.crosshair.body.velocity.x = 0}

        if (this.cursors.up.isDown) {
            // The speed we'll travel at
            this.crosshair.body.velocity.y = -200;
        } else if
        (this.cursors.down.isDown) {
            this.crosshair.body.velocity.y = 200;
        } else {this.crosshair.body.velocity.y = 0}

        if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
            this.fireBurst(this.crosshair);
        }

        this.spacemolegroup.forEach(function(mole){
            mole.rotation += .02;
        });


        this.physics.arcade.overlap(this.spacemolegroup, this.burst, this.spacemoleCollision, null, this);
        this.physics.arcade.overlap(this.molegroup, this.burst, this.moleCollision, null, this);
        //this.physics.arcade.overlap(this.bunnygroup, this.burst, this.friendlyFire, null);
    }


};