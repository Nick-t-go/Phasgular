WhackaMole.StartMenu = function(game) {
    this.startBG;
    this.startPrompt;
};

WhackaMole.StartMenu.prototype = {

	create: function () {


		startBG = this.add.image(0, 0 , 'titlescreen');
		startBG.inputEnabled = true;
		startBG.events.onInputDown.addOnce(this.startGame, this);

		startPrompt = this.add.bitmapText(this.world.centerX-155, -180, 'eightbitwonder', 'Touch to Start!', 24);
		this.add.tween(startPrompt).to( { y: this.world.centerY + 80 }, 4000, Phaser.Easing.Bounce.Out, true);
	},

	startGame: function (pointer) {
		this.state.start('Game');
	}
};