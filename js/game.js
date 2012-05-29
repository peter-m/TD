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
    this.width  = 800;
    /**
     * height of the stage
     * @type {Number}
     */
    this.height = 600;
    /**
     * width and height of the single tiles
     * @type {Number}
     */
    this.gutter = 10; // gutter is 10px wide

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
}

var game = new Game(document.getElementById("game"));
    game.init();