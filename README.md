my first tower defense game
=====
state of affairs:
-----
* OOP scripted (tried to keep the code DRY - I'm new to Javascript OOP though)
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
* creeps follow the path - if they reach the end the player loses a life

to do:
-----
* add turrets
* add further keyboard input support
* improve the way creeps are moving