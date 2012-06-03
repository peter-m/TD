<!doctype html>
<html>
<head>
    <title>HTML5 Tower Defense</title>
    <link rel="stylesheet" type="text/css" href="css/styles.css" media="all"/>
</head>
<body>
    <canvas id="game" width="800" height="600"></canvas>
    <div id="menu">
        <div>
            <span>lives:&nbsp</span><span id="lives"></span>
        </div>
        <div id="options">
            <form>
                <label for="highlightPath">highlight path</label><input type="checkbox" id="highlightPath"/>
            </form>
        </div>
    </div>
    <script type="text/javascript" src="js/lib/pathfinding/graph.js"></script>
    <script type="text/javascript" src="js/lib/pathfinding/a_star.js"></script>
    <script type="text/javascript" src="js/lib/kibo.min.js"></script>
    <script type="text/javascript" src="js/game.js"></script>
</body>

</html>