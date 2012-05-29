/**
 * game logic goes here
 */
function Game(canvas) {
    /**
     * reference to the canvas object to draw at
     * @type {canvas element}
     */
    this.canvas = canvas;
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


    //
    // CORE FUNCTIONS
    //

    /**
     * setup the entire game and define initial default values
     */
    this.init   = function () {
        // set intervals for running the game logic, etc.
    }

    /**
     * game logic like updating lives, etc. goes here
     */
    this.update = function() {

    }

    /**
     * render the entire logic
     */
    this.render = function() {
        // do something with this.canvas here
    }

    //
    // MISC
    //

    /**
     * shorthand for debugging purposes
     * @param  {anything} msg Object/String to be showed in the console
     */
    this.log    = function(msg) {
        console.log(msg);
    }


}

var game = new Game(document.getElementById("game"));
    game.init();