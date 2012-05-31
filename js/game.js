/**
 * game logic goes here
 */
function Game(canvas, window) {

    /////////////////////
    // VAR DECLARATION //
    /////////////////////

    /**
     * reference to the canvas DOM element
     * @type {DOM element}
     */
    this.canvas = canvas;
    /**
     * reference to the object to draw at
     * @type {canvas}
     */
    this.stage  = this.canvas.getContext('2d');
    /**
     * width of the stage
     * @type {Number}
     */
    this.width  = this.canvas.width;
    /**
     * height of the stage
     * @type {Number}
     */
    this.height = this.canvas.height;
    /**
     * width and height of the single tiles
     * @type {Number}
     */
    this.gutter = 10; // gutter is 10px wide
    /**
     * aimed frames per second
     * @type {Number}
     */
    this.FPS    = 30;
    /**
     * stores the games state (unitialized, running, paused)
     * @type {String}
     */
    this.state  = "unitialized";
    /**
     * defaults(=settings) are stored here
     * @type {Object}
     */
    this.default = {};
    this.default.color = {
        text: "#000",
        background: "#00A"
    }
    this.default.font  = {
        heading: "24px Helvetica",
        text:    "12px Helvetica"
    }

    /**
     * we want to position text as we are used to...
     */
    this.stage.textBaseline = "hanging";

    ////////////////////
    // CORE FUNCTIONS //
    ////////////////////
    
    /**
     * sets up the interval
     * @param  {Object} _this reference to the Game object
     */
    function startGameLoop(_this){
        _this.state = "running";
        _this.ticker = window.setInterval(function() {
            _this.update();
            _this.render();
        }, 1000/_this.FPS);
    }

    /**
     * setup the entire game and define initial default values
     */
    this.init   = function() {
        startGameLoop(this);
        this.menu = new Menu(600,0,200,600,this.default.color.background,this);
    }

    /**
     * clears the ticker
     */
    this.pause  = function() {
        this.state = "paused";
        window.clearInterval(this.ticker);
    }

    /**
     * resumes the game after stopping it
     */
    this.resume = function() {
        startGameLoop(this);
    }

    /**
     * game logic like updating lives, etc. goes here
     */
    this.update = function() {
        console.log("updating");
    }

    /**
     * render the entire logic
     */
    this.render = function() {
        this.stage.clearRect(0, 0, this.width, this.height);

        this.menu.render();
    }

    //////////////////
    // INGAME STUFF //
    //////////////////

    /**
     * Menu Class
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @param {Object} game   reference to the game object
     */
    function Menu(x,y,width,height,color,game){
        this.x      = x;
        this.y      = y;
        this.width  = width;
        this.height = height;
        this.color  = color;
        //this.game = game;

        this.render = function(){
            game.stage.save(); // saving settings like globalAlpha
            game.stage.globalAlpha = 0.4; // change them temporarily
            game.stage.fillStyle = this.color;
            game.stage.fillRect(this.x, this.y, this.width, this.height); // draw background
            game.stage.restore(); // restore settings (here: reset globalAlpha to default)
            game.drawText("heading","MENU",this.x+10,this.y+10,game.default.color.text);
        }
    }

    //////////
    // MISC //
    //////////

    /**
     * draw text on the stage
     * @param  {String} type  "heading"|"text" --> different font settings (style+size) will be applied
     * @param  {String} text  text to be displayed
     * @param  {Number} x     x-coordinate for displaying
     * @param  {Number} y     y-coordinate for displaying
     * @param  {String} color color to be displayed in
     */
    this.drawText = function(type,text,x,y,color) {
        this.stage.save();
        this.stage.fillStyle = color;
        switch (type) {
            case "heading":
                this.stage.font = this.default.font.heading;
                break;
            case "text":
                this.stage.font = this.default.font.text;
                break;
        }
        this.stage.fillText(text,x,y);
        this.stage.restore();
    }

    this.init();
}

var k    = new Kibo();
var game = new Game(document.getElementById("game"), window);

k.up("alt p", function(){
    (game.state==="running") ? game.pause() : game.resume();
});