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
     * aimed frames per second
     * @type {Number}
     */
    this.FPS    = 30;
    /**
     * stores the games state ("unitialized"|"running"|"paused")
     * @type {String}
     */
    this.state  = "unitialized";
    /**
     * stores all the information about the map
     * @type {Object}
     */
    this.map = // some JSON here, to be outsourced later on
    {
        "tiles":[
            [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,1,0,1],
            [1,0,1,1,1,0,1,1,1,0,1,0,0,0,0,1,1,1,0,1],
            [1,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
            [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,0,1]
        ]
    }
    /**
     * width and height of the single tiles
     * @type {Number}
     */
    this.map.gutterWidth = 40; // gutter is 40px wide
    /**
     * number of columns
     * @type {Number}
     */
    this.map.columns = this.width  / this.map.gutterWidth;
    /**
     * number of rows
     * @type {Number}
     */
    this.map.rows    = this.height / this.map.gutterWidth;
    /**
     * point where creeps spawn
     * @type {Array}
     */
    this.map.startingPoint = [0,1];
    /**
     * point where creeps want to get to
     * @type {Array}
     */
    this.map.endingPoint = [14,19];
    /**
     * Array with points the path consists of
     * @type {Array}
     */
    this.map.path = a_star(this.map.startingPoint, this.map.endingPoint, this.map.tiles);
    /**
     * defaults(=settings) are stored here
     * @type {Object}
     */
    this.default = {
        color: {
            text:       "#000",
            background: "#00A"
        },
        font: {
            heading: "24px Helvetica",
            text:    "12px Helvetica"
        }
    };
    /**
     * storing all the games infos like resources, lives, ...
     * @type {Object}
     */
    this.internal = {
        lives: 100, // if 100 creeps pass
        score: 0,  // waves passed
        resources: { // resources needed to build towers
            wood:  100,
            steel: 100
        },
        wave: [], // stores all the waves
        creeps: [] // stores all the creeps
    };

    /**
     * we want to position text as we are used to...
     */
    this.stage.textBaseline = "hanging";

    ////////////////////
    // CORE FUNCTIONS //
    ////////////////////
    
    /**
     * sets up the interval
     * @param  {Object} game reference to the Game object
     */
    function startGameLoop(game){
        game.state = "running";
        game.ticker = window.setInterval(function() {
            game.update();
            game.render();
        }, 1000/game.FPS);
    }

    /**
     * setup the entire game and define initial default values
     */
    this.init   = function() {
        startGameLoop(this);
        this.bg_map = new Map(this);
        this.internal.wave[0] = new Wave(this,[[Creep,10],[Creep,5]]);
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
        for (var i = 0; i < this.internal.creeps.length; i++) { // update position of all creeps
            this.internal.creeps[i].update();
        };
    }

    /**
     * render the entire logic
     */
    this.render = function() {
        this.stage.clearRect(0, 0, this.width, this.height);
        this.bg_map.render();
        this.bg_map.highlightPath();
        for (var i = 0; i < this.internal.creeps.length; i++) { // update position of all creeps
            this.internal.creeps[i].render();
        };
        //this.menu.render();
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
    function Menu(x, y, width, height, color, game) {
        this.x      = x;
        this.y      = y;
        this.width  = width;
        this.height = height;
        this.color  = color;

        this.render = function(){
            game.stage.save(); // saving settings like globalAlpha
                game.stage.globalAlpha = 0.4; // change them temporarily
                game.stage.fillStyle = this.color; // set color for the background
                game.stage.fillRect(this.x, this.y, this.width, this.height); // draw background
            game.stage.restore(); // restore settings (here: reset globalAlpha and color to default)

            game.stage.save();
                game.stage.translate(this.x, this.y); // set new "zero point"
                game.drawText("heading", "MENU", 10, 10, game.default.color.text); // draw heading
                game.drawText("text", "lives: " + game.internal.lives, 10, 50, game.default.color.text); // draw live counter
            game.stage.restore();
        }
    }

    /**
     * Map Class drawing the map as a background
     * @param {Object} game reference to the current game instance (Map class needs information about the tiles and access to the canvas 2D context)
     */
    function Map(game) {
        this.render = function(){
            var w = game.map.gutterWidth;
            game.stage.save();
            for (var i = 0; i < game.map.tiles.length; i++) { // i = row
                for (var j = 0; j < game.map.tiles[i].length; j++) { // j = column
                    switch(game.map.tiles[i][j]) {
                        case 0:
                            game.stage.fillStyle = "#FFF";
                            break;
                        case 1:
                            game.stage.fillStyle = "#000";
                            break;
                        default:
                            game.stage.fillStyle = "#000";
                            break;
                    }
                    game.stage.fillRect(j*w,i*w,w,w);
                };
            };
            game.stage.restore();
        }
        this.highlightPath = function(){
            var path = game.map.path,
                w    = game.map.gutterWidth;
            game.stage.save();
            game.stage.fillStyle = "#C0F";
            game.stage.globalAlpha = 0.6;
            for (var i = 0; i < path.length; i++) {
                game.stage.fillRect(path[i].y*w,path[i].x*w,w,w);
                game.drawText("text", i, path[i].y*w + 2, path[i].x*w + 2, "#000");
            };
            game.stage.restore();
        }
    }

    function Wave(game, creepList) {
        var creeps = game.internal.creeps;
        for (var i = 0; i < creepList.length; i++) { // for every group of creeps...
            for (var j = 0; j < creepList[i][1]; j++) { // ...spawn given amount of creeps
                creeps[creeps.length] = new creepList[i][0](game); // spawn the given class of creep
            };
        };
        console.log(creeps);
    }

    function Creep(game) {
        this.x      = game.map.path[0].x;
        this.y      = game.map.path[0].y;

        var tiles   = game.map.tiles;
        
        this.update = function(){
            
        }

        this.render = function(){

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