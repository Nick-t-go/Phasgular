WhackaMole.Game = function(game) {
    this.totalBunnies;
    this.bunnyGroup;
    this.totalSpacerocks;
    this.moleholegroup;
    this.totalSpacemoles
    this.spacerockgroup;
    this.bombGroup;
    this.spacemolegroup;
    this.burst;
    this.gameover;
    this.countdown;
    this.overmessage;
    this.newBomb;
    this.secondsElapsed;
    this.timer;
    this.music;
    this.ouch;
    this.boom;
    this.ding;
    this.molegroup;
    this.hole;
    this.crosshair;
    this.currentSpeed;
    this.emitter;
    this.molesWhacked;
    this.pausedText;
    this.points;
    this.pointsTween;
    this.animationReference;
    this.bomb;

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
        this.bombInit();
        this.buildSpaceMoles();


        this.crosshair = this.add.sprite(this.world.centerX,this.world.centerY, 'crosshair');
        this.crosshair.anchor.setTo(0.5,0.5);
        this.physics.arcade.enable(this.crosshair);
        this.crosshair.collideWorldBounds = true;
        this.crosshair.body.maxVelocity.setTo(400, 400);
        this.crosshair.body.collideWorldBounds = true;



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
        var random = that.rnd.integerInRange(1, 25);
        newMole.animations.play('Up', random, true);
        console.log(newMole.animations.currentAnim.loopCount);



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


    pointsTweener: function(kill){
        this.points = this.add.bitmapText(kill.x, kill.y, 'eightbitwonder', '100', 20);
        console.log(this.points);
        this.add.tween(this.points).to({ alpha: 0}, 2000, Phaser.Easing.Linear.None, true);

    },


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
            //this.pointsTweener(sm);
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
            this.pointsTweener(m);
            this.molesWhacked += 1;
            this.countdown.setText('Moles Whacked ' + this.molesWhacked)
        }
    },


    bombCollision: function(b) {
        console.log('got into collision')
        if(b.exists){
            this.ouch.play();
            //add explostion
            b.kill();
            this.pointsTweener(b);
            this.molesWhacked -= 1;
            this.countdown.setText('Moles Whacked ' + this.molesWhacked)
        }
    },

    respawnMole: function(m){
        console.log(m);
        that = this;
        if(this.gameover == false){
            this.time.events.add(Phaser.Timer.SECOND * 3, function() {
                var random = that.rnd.integerInRange(1, 100);
                random % 2 == 0 ? that.buildMoles(m.x, m.y) : that.buildBomb(m.x, m.y)
            })
        }

    },

    bombInit: function(){
        this.bombGroup = this.add.group();
    },

    buildBomb: function(x, y){
        var name = (x+y).toString();
        this[name] = this.bombGroup.create(x,y, 'bomb');
        this[name].anchor.setTo(0.5, 0.5);
        this.physics.enable(this[x+y], Phaser.Physics.ARCADE);
        this[name].enableBody = true;
        this[name].lifespan = 3000;
    },



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

        if(this.bombGroup) {
            this.bombGroup.forEach(function (bomb) {
                if(!bomb.visible ){
                    that.respawnMole(bomb);
                    bomb.destroy();
                }

            });
        }


        this.physics.arcade.overlap(this.spacemolegroup, this.burst, this.spacemoleCollision, null, this);
        this.physics.arcade.overlap(this.molegroup, this.burst, this.moleCollision, null, this);
        this.physics.arcade.overlap(this.bombGroup, this.burst, this.bombCollision, null, this);
    }


};