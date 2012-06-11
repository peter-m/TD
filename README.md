my first tower defense game
=====

state of affairs:
-----
* see a [demo](http://peter.muehlbacher.me/td) on my website
* using [jQuery](http://jquery.com/ "jQuery website") in order to circumvent cross-browser difficulties when trying to *attach custom events* and *detect mouse position*
* A* pathfinding algorithm (slightly modified version from [bgrins A* implementation](http://github.com/bgrins/javascript-astar "Link to bgrins' A* Github repository"))
* keyboard input (using [marquete's kibo library](http://github.com/marquete/kibo "Link to marquete's kibo Github repository")) - currently [Alt]+[P] will pause the game, more to follow soon
* maps are stored like this:

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

    0 = path, 1 = wall, 2 = something that slows down enemies and has a higher cost (A* algorithms will try to avoid it)

todo:
-----
* organize global/local variables
* remove unneccesary parameters for classes (e.g.color) and add others instead (spawning position for creeps)
* placeTower() should only handle the tower placing logic, everthing else should be handled externally
* find slicker jQuery alternative (prototype.js? --> has to handle mouse position, cross browser event listener adding and pub/sub management)
* don't pass entire game instance everytime --> memory management
* create Sprite class with hover/... listener and derive Creep/Tower/other interactive game objects of it
* add upgrading options for turrets
* don't start a wave immediately
* spawn minor creeps if a hard one gets killed
* clean up namespace conventions (in particular: replace every tower with turret and every draw with render)