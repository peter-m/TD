/**
 * game logic goes here
 */
function Game(canvas, document, window) {

    /////////////////////
    // VAR DECLARATION //
    /////////////////////

    /**
     * reference to the canvas DOM element
     * @type {Object}
     */
    this.canvas = canvas;
    /**
     * reference to the object to draw at
     * @type {Object}
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
     * map - stores all the information about the map
     * @type {Object}
     */
    this.map = {
        /**
         * stores info about the map
         * @type {Graph}
         */
        tiles: new Graph([
            [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,1,0,1],
            [1,0,1,1,1,0,1,1,1,0,1,0,0,0,0,1,1,1,0,1],
            [1,0,2,2,0,0,2,2,2,0,1,1,1,1,0,1,1,1,0,1],
            [1,0,2,2,0,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1,1,1,0,2,2,1,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1,1,1,0,1,2,1,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1,1,1,0,1,2,1,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1,1,1,0,1,2,2,2,0,1,1,1,0,1],
            [1,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
            [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,0,1]
        ]),
        /**
         * width and height of the single tiles
         * @type {Number}
         */
        gutterWidth: 40
    };
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
     * @type {Object}
     */
    this.map.startingPoint = this.map.tiles.nodes[0][1];
    /**
     * point where creeps want to get to
     * @type {Object}
     */
    this.map.endingPoint = this.map.tiles.nodes[14][18];
    /**
     * Array with points the path consists of
     * @type {Array}
     */
    this.map.path = astar.search(this.map.tiles.nodes, this.map.startingPoint, this.map.endingPoint);
    /**
     * defaults(=settings) are stored here
     * @type {Object}
     */
    this.default = {
        /**
         * default colors for various purposes
         * @type {Object}
         */
        color: {
            /**
             * default color for text
             * @type {String}
             */
            text:       "#000",
            /**
             * default color for backgrounds
             * @type {String}
             */
            background: "#00A"
        },
        /**
         * font settings for various purposes
         * @type {Object}
         */
        font: {
            /**
             * font settings for headings
             * @type {String}
             */
            heading: "24px Helvetica",
            /**
             * font settings for normal text
             * @type {String}
             */
            text:    "12px Helvetica"
        }
    };
    /**
     * storing all the games infos like resources, lives, ...
     * @type {Object}
     */
    this.internal = {
        /**
         * if 100 creeps pass, you've lost
         * @type {Number}
         */
        lives: 100,
        /**
         * how far did you get?
         * @type {Number}
         */
        score: 0,
        /**
         * resources needed to build towers
         * @type {Object}
         */
        resources: {
            wood:  100,
            steel: 100
        },
        /**
         * stores all the waves
         * @type {Array}
         */
        wave: [],
        /**
         * stores references to all the creeps
         * @type {Array}
         */
        creeps: []
    };
    /**
     * stores some variables for debugging
     * @type {Object}
     */
    this.debug = {
        /**
         * should the path be highlighted or not?
         * @type {Boolean}
         */
        highlightPath: false
    }
    /**
     * stores the coordinates of the currently hovered tile
     * @type {Object}
     */
    this.hoveredTile = {}

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
        startGameLoop(this); // start the ticker
        /**
         * stores the tiles' visualization
         * @type {Map}
         */
        this.bg_map = new Map(this);
        this.internal.wave[0] = new Wave(this,[[Creep,10],[Creep,5]]); // initiate a new wave
        /**
         * reference to the menu object
         * @type {Menu}
         */
        this.menu = new Menu(this, document);
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
        // calculate the currently hovered tile's coordinates
        this.hoveredTile.x = Math.floor(mouse.x / (2*this.map.gutterWidth));
        this.hoveredTile.y = Math.floor(mouse.y / (2*this.map.gutterWidth));
        /**
         * shorthand for list of all creeps
         * @type {Array}
         */
        var creeps = this.internal.creeps;
        for (var i = 0; i < creeps.length; i++) { // update position of all creeps
            if (creeps[i] !== undefined) { // don't try to update deleted creeps
                creeps[i].update();
            }
        };
    }

    /**
     * render the entire logic
     */
    this.render = function() {
        this.stage.clearRect(0, 0, this.width, this.height); // make canvas white again to draw something new onto it
        this.bg_map.render(); // render the tiles
        if (this.debug.highlightPath) this.bg_map.highlightPath(); // highlight the path (rather for testing purposes)
        /**
         * shorthand for list of creeps to be rendered
         * @type {Array}
         */
        var creeps = this.internal.creeps;
        for (var i = 0; i < creeps.length; i++) { // update position of all creeps
            if (creeps[i] !== undefined) { // don't try to render deleted creeps
                creeps[i].render();
            }
        };
        this.menu.render(); // render the menu to display options, infos, etc.
    }

    //////////////////
    // INGAME STUFF //
    //////////////////

    /**
     * Menu Class
     * @param {Object} game   reference to the game object
     */
    function Menu(game) {
        /**
         * reference to the DOM element displaying the lives
         * @type {Object}
         */
        this.lives = document.getElementById("lives");

        /**
         * display the information
         */
        this.render = function(){
            this.lives.innerHTML = game.internal.lives+''; // +'' converts Number to String
        }
    }

    /**
     * Map Class drawing the map as a background
     * @param {Object} game reference to the current game instance (Map class needs information about the tiles and access to the canvas 2D context)
     */
    function Map(game) {
        /**
         * shorthand for gutterWidth
         * @type {Number}
         */
        var w = game.map.gutterWidth;

        /**
         * renders all the tiles
         */
        this.render = function(){
            /**
             * shorthand for the tiles Array storing the type of each tile
             * @type {Array}
             */
            var tiles = game.map.tiles.input;
            game.stage.save();
                for (var i = 0; i < tiles.length; i++) { // i = row
                    for (var j = 0; j < tiles[i].length; j++) { // j = column
                        switch(tiles[i][j]) { // depending on which type a tile is, take a different color to draw it
                            case 0:
                                game.stage.fillStyle = "#FFF";
                                break;
                            case 1:
                                game.stage.fillStyle = "#000";
                                break;
                            case 2:
                                game.stage.fillStyle = "#FA0";
                                break;
                            default:
                                game.stage.fillStyle = "#000";
                                break;
                        }
                        game.stage.fillRect(j*w,i*w,w,w); // draw the tile
                    };
                };
            game.stage.restore();
        }
        /**
         * distinguish the path from other tiles
         */
        this.highlightPath = function(){
            /**
             * shorthand for path
             * @type {Array}
             */
            var path = game.map.path;
                
            game.stage.save();
                game.stage.fillStyle = "#C0F";
                game.stage.globalAlpha = 0.6;
                for (var i = 0; i < path.length; i++) { //for every part of the path...
                    game.stage.fillRect(path[i].y*w,path[i].x*w,w,w); // ... draw a rect
                    game.drawText("text", i, path[i].y*w + 2, path[i].x*w + 2, "#000"); // ... and add the index of it
                };
            game.stage.restore();
        }
    }

    function Wave(game, creepList) {
        /**
         * shorthand for the list of creeps
         * @type {Array}
         */
        var creeps = game.internal.creeps;
        for (var i = 0; i < creepList.length; i++) { // for every group of creeps...
            for (var j = 0; j < creepList[i][1]; j++) { // ...spawn given amount of creeps
                creeps[creeps.length] = new creepList[i][0](game); // spawn the given class of creep
            };
        };
        /**
         * calls the spawnCreep function every second to spawn a new creep
         * @type {Interval}
         */
        var creepSpawner = window.setInterval(spawnCreep, 1000);
        /**
         * counter used to iterate through the list of all creeps
         * @type {Number}
         */
        var i = 0;
        /**
         * spawns the "i"th creep of the game.internal.creeps Array until there is none left --> then clear the timer (creepSpawner)
         */
        function spawnCreep(){
            creeps[i].spawn();
            i++;
            if (creeps[i] === undefined) { // if there is no more creep to spawn...
                window.clearInterval(creepSpawner); // ... stop the timer
            }
        }
    }

    function Creep(game) {
        /**
         * counter - stands for the "i"th point of the path the creep is on
         * @type {Number}
         */
        var i    = 0,
        /**
         * shorthand for tiles
         * @type {Object}
         */
        tiles    = game.map.tiles,
        /**
         * shorthand for path
         * @type {Array}
         */
        path     = game.map.path,
        /**
         * shorthand for gutterWidth
         * @type {Number}
         */
        w        = game.map.gutterWidth,
        /**
         * tolerance whether a point has been reached or not (if set to 0 the creep has to be exactly on the point - this will never be the case though)
         * @type {Number}
         */
        tolerance= 10/w;
        /**
         * x-coordinate, is _not_ in pixels, but in squares (e.g. 3 squares from the left)
         * @type {Number}
         */
        this.x       = path[i].x;
        /**
         * y-coordinate, is _not_ in pixels, but in squares (e.g. 2 squares from the top)
         * @type {Number}
         */
        this.y       = path[i].y;
        /**
         * how fast the creep is moving
         * @type {Number}
         */
        this.speed   = 4;
        /**
         * for resetting (stores the original speed)
         * @type {Number}
         */
        this._speed  = this.speed;
        /**
         * stores the coordinates of the next point the creep moves towards to
         * @type {Object}
         */
        this.next    = {
            "x": path[i+1].x,
            "y": path[i+1].y
        };
        /**
         * indicates whether the creep is spawned (--> moves) or not (has not yet been spawned, has reached the end or has been killed) 
         * @type {Boolean}
         */
        this.spawned = false;

        /**
         * recalculates the position, etc. (more to follow?)
         */
        this.update  = function(){
            if(this.spawned) {
                var type = tiles.input[Math.floor(this.x)][Math.floor(this.y)]; // strip out everything after the coordinates' comma to get decimal numbers and check what type of tile it is in order to adjust speed, etc.
                switch(type) {
                    case 2:
                        this.speed = this._speed/2; // slow down if type == 2
                        break;
                    default:
                        this.speed = this._speed; // do nothing(/reset to default) if there's nothing special
                        break;
                }

                // this block of code is kind of weird because of the map's nature x and y are swapped
                // moves creep dependent on their speed (it's "/w" because the creep's coordinates are not in pixels --> don't move 2 fields when speed = 2)
                if ((this.next.x - this.x) < 0) { // if we are moving right
                    this.x -= this.speed/w;
                } 
                if ((this.next.x - this.x) > 0) { // if we are moving left
                    this.x += this.speed/w;
                }
                if ((this.next.y - this.y) < 0) { // if we are moving up
                    this.y -= this.speed/w;
                }
                if ((this.next.y - this.y) > 0) { // if we are moving down
                    this.y += this.speed/w;
                }

                if ((this.x <= this.next.x+tolerance && this.x >= this.next.x-tolerance) && (this.y <= this.next.y+tolerance && this.y >= this.next.y-tolerance)) { // if next point has been reached
                    i++; // increase counter by one
                    if (path[i+1] !== undefined) { // check if there is a next point and if so ...
                        this.next.x = path[i+1].x; // ... set next.x and next.y to the ones of the next point
                        this.next.y = path[i+1].y;
                    }
                    else { // if there is no point left, creep has reached the end
                        this.spawned = false; // remove it
                        game.internal.lives--; // remove one life
                    }
                }
            }
        }
        /**
         * display the creep
         */
        this.render  = function(){
            if(this.spawned) { // only display if it's spawned
                game.stage.save();
                    game.stage.fillStyle = "#C0F";
                    game.stage.fillRect(this.y*w + w/4, this.x*w + w/4, w/2, w/2); // remember coordinates are not in pixels --> we have to multiply them with the gutterWidth
                game.stage.restore();
            }
        }
        /**
         * spawn a creep
         */
        this.spawn   = function(){
            this.spawned = true;
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

    this.init(); // initiate the whole game
}

    /**
     * initiate the keyboard library
     * @type {Kibo}
     */
var k     = new Kibo(),
    /**
     * DOM reference to the canvas object
     * @type {Object}
     */
   _game  = document.getElementById("game"),
    /**
     * start the game
     * @type {Game}
     */
    game  = new Game(_game, document, window),
    /**
     * stores mouse position relative to the canvas object
     * @type {Object}
     */
    mouse = {};

///////////////////////////////
// update the mouse position //
///////////////////////////////
$(document).mousemove(function(e){
    mouse.x = e.pageX - _game.offsetLeft;
    mouse.y = e.pageY - _game.offsetTop;
});

///////////////////////////////////////////
// add some keyboard input functionality //
///////////////////////////////////////////
k.up("alt p", function(){
    (game.state==="running") ? game.pause() : game.resume();
});

///////////////////////////////////////////////
// add some settings to be made via the menu //
///////////////////////////////////////////////
document.getElementById("highlightPath").addEventListener("click",function(){
    game.debug.highlightPath = !game.debug.highlightPath; // toggle the highlightPath option
}, false);