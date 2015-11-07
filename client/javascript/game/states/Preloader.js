WhackaMole.Preloader = function(game) {
	this.preloadBar = null;
	this.titleText = null;
	this.ready = false;
};

WhackaMole.Preloader.prototype = {

	preload: function () {
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);
		this.load.setPreloadSprite(this.preloadBar);
		this.titleText = this.add.image(this.world.centerX, this.world.centerY-220, 'titleimage');
		this.titleText.anchor.setTo(0.5, 0.5);
		this.load.image('titlescreen', 'images/Titlebackground.png');
		this.load.bitmapFont('eightbitwonder', 'fonts/eightbitwonder.png', 'fonts/eightbitwonder.fnt');
		this.load.image('land', 'images/land.png');
		this.load.image('sky', 'images/sky.png');
		this.load.image('moon', 'images/moon.png');
		this.load.image('stars', 'images/stars.png');
		this.load.image('crosshair', 'images/crosshair.png');
		this.load.atlasJSONHash('mole', 'images/spritesheets/mole.png', 'images/spritesheets/mole.json');
		this.load.atlasJSONHash('mole', 'images/spritesheets/hole.png', 'images/spritesheets/hole.json');
		this.load.atlasXML('bunny', 'images/spritesheets/bunny.png', 'images/spritesheets/bunny.xml');
		this.load.atlasXML('spacerock', 'images/spritesheets/SpaceRock.png', 'images/spritesheets/SpaceRock.xml');
		this.load.image('explosion', 'images/explosion.png');
		this.load.image('ghost', 'images/ghost.png');
		this.load.audio('explosion_audio', 'audio/explosion.mp3');
		this.load.audio('hurt_audio', 'audio/hurt.mp3');
		this.load.audio('select_audio', 'audio/select.mp3');
		this.load.audio('game_audio', 'audio/bgm.mp3');
	},

	create: function () {
		this.preloadBar.cropEnabled = false;
	},

	update: function () {
		if(this.cache.isSoundDecoded('game_audio') && this.ready == false) {
			this.ready = true;
			this.state.start('StartMenu');
		}
	}
};