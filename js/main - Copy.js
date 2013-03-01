/******************************************************************************************
					Guling galau(tm). 2012
					
					The run and jump game based on HTML5 Canvas. 
					
					Build with melonJs.
					
					By: rebotak.

******************************************************************************************/



//Game resources
var g_ressources = [
	{name: "font",				type: "image",src: "images/font.png"},
	{name: "levelcomplete",		type: "image",src: "images/levelcomplete.png"},
	{name: "levelcompletebg",	type: "image",src: "images/levelcompletebg.png"},
	{name: "creditos",			type: "image",src: "images/creditos.png"},
	{name: "intro",			type: "image",src: "images/intro.png"},
	{name: "menu",				type: "image",src: "images/menu.png"},
	{name: "menu_arrow",		type: "image",src: "images/bolinha_menu.png"},
	//Parallel Background biar keliatan nyata.
	{name: "pl01",				type: "image",src: "images/background/frente.png"},
	{name: "pl02",				type: "image",src: "images/background/chao.png"},
	{name: "pl03",				type: "image",src: "images/background/torre.png"},
	{name: "pl04",				type: "image",src: "images/background/montanha.png"},
	{name: "pl05",     			type: "image",src: "images/background/ceu.png"},
	{name: "spinning_coin_gold",type: "image",src: "images/coin.png"},

	//level tileset yang dipake!
    {name: "tileset-platformer",type:"image",src: "images/tileset-platformer.png"},
	{name: "meta",type:"image",src: "images/metatiles32x32.png"},
	//foreground buat di depan layer player
	{name: "frente",  			type:"image",src: "images/background/frente.png"},
    // daftar levels!
    {name: "fase1",             type: "tmx",src: "maps/fase1.tmx"},
    {name: "fase2",             type: "tmx",src: "maps/fase2.tmx"},
    {name: "fase3",             type: "tmx",src: "maps/fase3.tmx"},
    {name: "fase4",             type: "tmx",src: "maps/fase4.tmx"},
    {name: "fase5",             type: "tmx",src: "maps/fase5.tmx"},
    {name: "fase6",             type: "tmx",src: "maps/fase6.tmx"},
	//character utama sama musuh
	{name: "galau",     		type: "image",  src: "images/galau.png"},
	{name: "guling",			type: "image",  src: "images/guling.png"},

	//sounds
	{name: "limbo",     type: "audio",  src: "sounds/", channel:1},
	{name: "physic",    type: "audio",  src: "sounds/", channel:1},
	{name: "alarm",    type: "audio",  src: "sounds/", channel:1},
	{name: "transition",type: "audio",  src: "sounds/", channel:1},
	{name: "wee",     	type: "audio",  src: "sounds/", channel:2},
	{name: "cling",     type: "audio",  src: "sounds/", channel:2},
	{name: "stomp",     type: "audio",  src: "sounds/", channel:2},
	{name: "jump",     	type: "audio",  src: "sounds/", channel:2},

	//HUD spirit bar
	{name: "barra-a-0",  type: "image",   src: "images/barra-a-0.png"},
	{name: "barra-a-1",  type: "image",   src: "images/barra-a-1.png"},
	{name: "barra-a-2",  type: "image",   src: "images/barra-a-2.png"},
	{name: "barra-a-3",  type: "image",   src: "images/barra-a-3.png"},
	{name: "barra-a-4",  type: "image",   src: "images/barra-a-4.png"},
	{name: "barra-a-5",  type: "image",   src: "images/barra-a-5.png"},
	{name: "barra-a-6",  type: "image",   src: "images/barra-a-6.png"},
	{name: "barra-a-7",  type: "image",   src: "images/barra-a-7.png"},
	{name: "barra-a-8",  type: "image",   src: "images/barra-a-8.png"},

];

/*--------------------------jjsApp
----------------------*/
var jsApp	=
{
	onload: function()
	{

		//DEBUG mode
		//me.debug.renderHitBox = true;

		// init the video
		if (!me.video.init('jsapp', 640, 480, false, 1.0))
		{
			alert("Sorry but your browser does not support html 5 canvas. Please try with another one!");
			return;
		}

		// initialize the "audio"
		me.audio.init("mp3");

		// set all ressources to be loaded
		me.loader.onload = this.loaded.bind(this);

		// set all ressources to be loaded
		me.loader.preload(g_ressources);

		// load everything & display a loading screen
		//me.state.set(me.state.LOADING, new LoadingScreen());
		me.state.change(me.state.LOADING);
	},

	//Callback when its loaded
	loaded: function ()
	{
		//SCREENS
		me.state.set(me.state.MENU, new TitleScreen());
		me.state.set(me.state.CREDITS, new CreditsScreen());
		me.state.set(me.state.INTRO, new IntroScreen());
		me.state.set(me.state.PLAY, new PlayScreen());
		me.state.set(me.state.READY, new LevelCompleteScreen());
		// set the "Game Over" Screen Object
		me.state.set(me.state.GAMEOVER, new GameOverScreen());
		// set a fade transition effect
		me.state.transition("fade","#f7941d", 200);
		// disable transition for the GAME OVER STATE
		me.state.setTransition(me.state.GAMEOVER, false);
		
		me.entityPool.add("mainPlayer", PlayerEntity);
		me.entityPool.add("coinEntity", CoinEntity);
		me.entityPool.add("foregroundEntity", ForegroundEntity);
		me.entityPool.add("enemyEntity", EnemyEntity);
		me.entityPool.add("tmxlevelcomplete", TMXLevelEntity);
		//enable highscore
		me.gamestat.add("hiscore",this.readHiScore());
		me.gamestat.add("score", 0);
		// enable the keyboard
		me.input.bindKey(me.input.KEY.LEFT,"left");
        me.input.bindKey(me.input.KEY.RIGHT,"right");
        me.input.bindKey(me.input.KEY.UP,"up",true);
        me.input.bindKey(me.input.KEY.DOWN,"down",true);
        me.input.bindKey(me.input.KEY.ENTER,"enter", true);
        me.input.bindKey(me.input.KEY.X,"jump", true);
		me.input.bindKey(me.input.KEY.Z,"x", true);
		me.input.bindKey(me.input.KEY.UP, "up", true);

		//DEBUG key
		me.input.bindKey(me.input.KEY.K,"k", true);

		//Pause screen
		me.state.onPause = function () {
            // get the current context
			var context = me.video.getScreenFrameBuffer();
			
			// create a black & white copy of the background
			var background = me.video.applyRGBFilter(me.video.getScreenCanvas(), "b&w");
			
			// draw the background
			context.drawImage(background.canvas, 0, 0);

			
			//draw a black transparent square
			context.fillStyle = "rgba(0, 0, 0, 0.8)";
			context.fillRect(0, (me.video.getHeight()/2) - 30, me.video.getWidth(), 60);
         
			// create a font (scale 3x)
			var font = new me.BitmapFont("font", 32);
			font.set("left");
			// get the text size
			var measure = font.measureText("P A U S E");
			// a draw "pause" ! 
			font.draw (context, "P A U S E", 
					   (me.video.getWidth()/2) - (measure.width/2) , 
					   (me.video.getHeight()/2) - (measure.height/2));

        };

		//Global Game Vars
		
		me.gamestat.add("spirit_value",0);
		me.gamestat.add("total_coins",0);
		me.totalcoins = 10;

		// start the game
		me.state.change(me.state.MENU);
	},
	
	writeHiScore : function (val)
	{
		if (me.sys.localStorage)
		{
			try 
			{	
				lval = this.readHiScore();
				if (val > lval)
				{ 
					//saves to the database, "key", "value"
					localStorage.setItem("mefw_hiscore", val); 
				}
			} 
			catch (e){/*sthg went wrong*/}
		}
	},
	
	/* 
	   read the hiscore from localstorage
	 */
	readHiScore : function ()
	{
		if (me.sys.localStorage)
		{
			try 
			{	
				//get the database value
				return (localStorage.getItem("mefw_hiscore") || 0); 
			} 
			catch (e){/*sthg went wrong*/}
		}
		return 0;
	}

};
//end jsApp

/*******************************************
********************************************
********** Game Screens****************
********************************************
********************************************
*/

/*---------------------------------------------------------------------
			//LOADING
---------------------------------------------------------------------*/

var LoadingScreen = me.ScreenObject.extend({
   // constructor
   init: function(){
      this.parent(true);
      this.font = new me.BitmapFont("font", 32);
      this.logo = new me.Font('font', 32);
      this.invalidate = false;
      this.loadPercent = 0;
      me.loader.onProgress = this.onProgressUpdate.bind(this);

   },

   // will be fired by the loader each time a resource is loaded
   onProgressUpdate: function(progress) {
      this.loadPercent = progress;
      this.invalidate = true;
   },

   // make sure the screen is only refreshed on load progress
   update: function() {
      if (this.invalidate===true) {
         this.invalidate = false;
         return true;
      }
      return false;
   },

   onDestroyEvent : function () {
      // "nullify" all fonts
      this.logo = null;
   },

   draw : function(context) {
      me.video.clearSurface(context, "back");
      this.font.draw(context, "LOADING..", 320,240);
      var width = Math.floor(this.loadPercent * context.canvas.width);
      context.strokeStyle = "silver";
      context.strokeRect(0, (context.canvas.height / 2) + 40, context.canvas.width, 6);
      context.fillStyle = "#89b002";
      context.fillRect(2, (context.canvas.height / 2) + 42, width-4, 2);
   },
});


/*---------------------------------------------------------------------

					//MENU

---------------------------------------------------------------------*/

var TitleScreen = me.ScreenObject.extend({
    init: function() {
        this.parent(true);
        this.title = null;
        this.font = null;
		this.arrow = null;
        this.menuItems = [];
        this.selectedItem = 0;
		this.tween = null;
    },
	
    onResetEvent: function() {
		me.input.bindKey(me.input.KEY.ENTER,"enter", true);
        me.audio.playTrack("physic");
		
		if (this.title == null){
            this.title = me.loader.getImage("menu");
            this.font = new me.BitmapFont("font", 32);
            this.font.set("left");
			this.arrow = new me.SpriteObject(80, 80, me.loader.getImage("menu_arrow"));
            this.menuItems[0] = new me.Vector2d(200, 350);
            this.menuItems[1] = new me.Vector2d(200, 415);
        }
		this.tween = new me.Tween(this.arrow.pos).to({
			x: 200
		},400).onComplete(this.tweenbw.bind(this)).start();


        this.arrow.pos.y = this.menuItems[this.selectedItem].y;
		pb = new me.ParallaxBackgroundEntity(1);
        pb.addLayer("menu", 1, 1);
        me.game.add(pb);

        me.game.add(this.arrow, 100);
	},

	tweenbw: function(){
		this.tween.to({
			x:190
		},400).onComplete(this.tweenff.bind(this)).start();
	},

	tweenff: function(){
		this.tween.to({
			x:200
		},400).onComplete(this.tweenbw.bind(this)).start();
	},

    update: function() {
		if (me.input.isKeyPressed("up")) {
            if (this.selectedItem > 0) {
                this.selectedItem--;
            }
            this.arrow.pos.y = this.menuItems[this.selectedItem].y;
            me.audio.play("cling", false);
            return true;
        }
        if (me.input.isKeyPressed("down")) {
            if (this.selectedItem < this.menuItems.length - 1) {
                this.selectedItem++;
            }
            this.arrow.pos.y = this.menuItems[this.selectedItem].y;
            me.audio.play("cling", false);
            return true;
        }
        if (me.input.isKeyPressed("enter")) {
            if (this.selectedItem == 0) {
                me.state.change(me.state.INTRO)
            }
			if (this.selectedItem == 1) {
                me.state.change(me.state.CREDITS)
            }
            return true;
        }

        return true;
    },

    draw: function(context) {
        this.font.draw(context, " ", 270, 350);
        this.font.draw(context, " ", 245, 415);
    },
	onDestroyEvent: function () {
        me.input.unbindKey(me.input.KEY.ENTER);
    },

});

//LEVEL CheckPoint
var TMXLevelEntity = me.LevelEntity.extend({
    init: function (a, c, b) {
        this.parent(a, c, b);
        this.updateColRect(20, 24, 24, 40)
    },
    onCollision: function () {
        this.collidable = false;
		//if (me.totalcoins == 0)
			me.state.change(me.state.READY);

    }
});

/*---------------------------------------------------------------------

				//LEVEL COMPLETE

---------------------------------------------------------------------*/
LevelCompleteScreen = me.ScreenObject.extend({
    init: function () {
        this.parent(true);
        this.title = null;
        this.font = null;
        this.postitle = 0;
        this.tween = null;
        this.background = null;
    },

    onResetEvent: function (a) {
        if (this.font == null) {
            this.title = me.loader.getImage("levelcomplete");
            this.font = new me.BitmapFont("font", 32)
        }
        this.tweenfinished = false;
        this.postitle = 0 - this.title.height;
        this.tween = new me.Tween(this).to({
            postitle: 150
        }, 750).onComplete(this.tweencb.bind(this));
        this.tween.easing(me.Tween.Easing.Bounce.EaseOut);
        this.tween.start();
        me.input.bindKey(me.input.KEY.ENTER, "enter");
        me.input.bindKey(me.input.KEY.ESC, "enter");

		me.game.disableHUD();
        pb.addLayer("levelcompletebg", 1, 1);
		me.game.add(pb);
    },

    tweencb: function () {
        this.tweenfinished = true
    },

    update: function () {
        if (me.input.isKeyPressed("enter")) {
            me.state.change(me.state.MENU);
			}
        return true
    },

    draw: function (a) {
        a.drawImage(this.title, (a.canvas.width - this.title.width) / 2, this.postitle);
        this.font.set("left");
    },

    onDestroyEvent: function () {
        me.input.unbindKey(me.input.KEY.ENTER);
        me.input.unbindKey(me.input.KEY.ESC);
        this.tween.stop();
    }
});

/*---------------------------------------------------------------------
		
					//CREDITS SCREEN

---------------------------------------------------------------------*/

CreditsScreen = me.ScreenObject.extend({
    init: function () {
        this.parent(true);
        this.title = null;
        this.font = null
    },
    onResetEvent: function () {
        if (this.title == null) {
            this.title = me.loader.getImage("creditos");
            this.font = new me.BitmapFont("font", 32);
            this.font.set("center");
        }
        me.input.bindKey(me.input.KEY.ESC, "enter", true);
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);

		pb = new me.ParallaxBackgroundEntity(1);
        pb.addLayer("creditos", 1, 1);
        me.game.add(pb);
    },
    update: function () {
        if (me.input.isKeyPressed("enter")) {
            me.state.change(me.state.INTRO);
        }
        return true
    },

	onDestroyEvent: function () {
		me.input.unbindKey(me.input.KEY.ENTER);
        me.input.unbindKey(me.input.KEY.ESC);
    }

});
/*---------------------------------------------------------------------

						//INTRO PAGE

---------------------------------------------------------------------*/

IntroScreen = me.ScreenObject.extend({
    init: function () {
        this.parent(true);
        this.title = null;
        this.font = null
    },
    onResetEvent: function () {
        if (this.title == null) {
            this.title = me.loader.getImage("intro");
            this.font = new me.BitmapFont("font", 32);
            this.font.set("center");
        }
        me.input.bindKey(me.input.KEY.ESC, "enter", true);
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);

		pb = new me.ParallaxBackgroundEntity(1);
        pb.addLayer("intro", 1, 1);
        me.game.add(pb);
    },
    update: function () {
        if (me.input.isKeyPressed("enter")) {
            me.state.change(me.state.PLAY);
        }
        return true
    },

	onDestroyEvent: function () {
		me.input.unbindKey(me.input.KEY.ENTER);
        me.input.unbindKey(me.input.KEY.ESC);
    }

});
/*---------------------------------------------------------------------

	A Gameover Screen
	
  ---------------------------------------------------------------------	*/

GameOverScreen  = me.ScreenObject.extend(
{
	init : function()
	{
		this.parent(true); // next state
		
		this.font  =  null;
		
		this.background = null;
		
		this.saveScore = false;
	},

	
	/* ---
		reset function
	   ----*/
	
	onResetEvent : function(levelId)
	{
		
		if (this.font == null)
		{
			// font to display the menu items
			this.font4x = new me.BitmapFont("font", 32);
			this.font4x.set("left",2);
			this.font2x = new me.BitmapFont("font", 32);
			this.font2x.set("left",0.91);
		}
		
		this.scale = 4.0;
		this.saveScore = false;
		
		// create a new canvas 
		this.background = me.video.applyRGBFilter(me.video.getScreenCanvas(), "b&w");
		
		
		me.input.bindKey(me.input.KEY.ENTER, "enter");
		me.input.bindKey(me.input.KEY.ESC,	 "esc");
		
		// game over sound
		me.audio.play("wee");
		me.audio.stop("alarm");
		this.alarm = false;
	},
	
		/*---
		
		update function
		 ---*/
		
	update : function()
	{
		
		if (this.scale > 1.0)
		{
			this.scale -= 0.1;
		}
		else
		{	
			/*
			if (!this.saveScore)
			{
				try 
				{
					//save our score
					tapjsHighScores.save(me.gamestat.getItemValue("hiscore"), "", "no");
				} 
				catch(e){};
				this.saveScore = true;
			}
			*/
			
			if (me.input.isKeyPressed('enter'))
			{
				location.reload(true);
			}
			else if (me.input.isKeyPressed('esc'))
			{
				location.reload(true);
			}
		}
		return true;
	},
	
	
	/*---
	
		the manu drawing function
	  ---*/
	
	draw : function(context)
	{
		// draw the background
		context.drawImage(this.background.canvas, 0, 0);
		
		// save the current context
		context.save();
		// scale and keep centered
		if (this.scale != 1.0)
			me.video.scale(context, this.scale);
		
		this.font4x.draw (context, "TIME'S UP!", 1, 150);
		// restore context
		context.restore();

		if (this.scale <= 1.0)
		{
			this.font2x.draw (context, "PRESS ENTER TO RELOAD!", 1, 300);
		}
	},
	
	/*---
	
		the manu drawing function
	  ---*/
	
	onDestroyEvent : function()
	{
		me.input.unbindKey(me.input.KEY.ENTER);
		me.input.unbindKey(me.input.KEY.ESC);
	}

});


/*---------------------------------------------------------------------

					//PLAY SCREEN

---------------------------------------------------------------------*/


var PlayScreen = me.ScreenObject.extend({

	onResetEvent: function(){
		me.levelDirector.loadLevel("fase1");
        me.game.addHUD(0, 0, 640, 480);
		
		
		// add HUD Item on screen
		me.game.HUD.addItem("hiscore", new HUDHiScoreObject	(10, 10, me.gamestat.getItemValue("hiscore")));
		me.game.HUD.addItem("life",	 new HUDLifebject	(190, 12, 1500));
		me.game.HUD.addItem("score", new HUDScoreObject	(510, 10, 0));
		
		
		me.game.HUD.addItem("hud_spirit",new HUDSpiritObject(288,20));
		me.game.currentLevel.getLayerByName("b_s").visible = false;
		me.game.currentLevel.getLayerByName("f_s").visible = false;
		me.audio.playTrack("physic");
		me.gamestat.setValue('total_coins',me.game.getEntityByName("coinEntity").length);

	},

	onDestroyEvent: function(){
		me.audio.stopTrack();
    }

});

/*---------------------------------------------------------------------

				//HUD entity piringan semangat

---------------------------------------------------------------------*/

var HUDSpiritObject = me.HUD_Item.extend({
    init: function (a, b) {
        this.parent(a, b, me.gamestat.getItemValue("spirit_value"));
        this.spiritIcon = me.loader.getImage("barra-a-"+me.gamestat.getItemValue("spirit_value"));
    },

    draw: function (c, b, d) {
        var a = this.pos.x;
		if (this.value >=8) this.value = 8;
		this.spiritIcon = me.loader.getImage("barra-a-"+this.value);
        c.drawImage(this.spiritIcon, a, this.pos.y);
    }
});


window.onReady(function()
{
	jsApp.onload();
});
