/*
Copyright (C) 2009 by Benjamin Hardin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

function a_star(start, destination, board)
{
    //Create start and destination as true Nodes
    start = new Node(start[0], start[1], -1, -1, -1, -1);
    destination = new Node(destination[0], destination[1], -1, -1, -1, -1);

    var rows = board[0].length; // x and y coordinates are swapped

    var columns = board.length;

    var open = []; //List of open Nodes (Nodes to be inspected)
    var closed = []; //List of closed Nodes (Nodes we've already inspected)

    var g = 0; //Cost from start to current Node
    var h = heuristic(start, destination); //Cost from current Node to destination
    var f = g+h; //Cost from start to destination going through the current Node

    //Push the start Node onto the list of open Nodes
    open.push(start); 

    //Keep going while there's Nodes in our open list
    while (open.length > 0)
    {
        //Find the best open Node (lowest f value)

        //Alternately, you could simply keep the open list sorted by f value lowest to highest,
        //in which case you always use the first Node
        var best_cost = open[0].f;
        var best_Node = 0;

        for (var i = 1; i < open.length; i++)
        {
            if (open[i].f < best_cost)
            {
                best_cost = open[i].f;
                best_Node = i;
            }
        }

        //Set it as our current Node
        var current_Node = open[best_Node];

        //Check if we've reached our destination
        if (current_Node.x == destination.x && current_Node.y == destination.y)
        {
            var path = [destination]; //Initialize the path with the destination Node

            //Go up the chain to recreate the path 
            while (current_Node.parent_index != -1)
            {
                current_Node = closed[current_Node.parent_index];
                path.unshift(current_Node);
            }

            return path;
        }

        //Remove the current Node from our open list
        open.splice(best_Node, 1);

        //Push it onto the closed list
        closed.push(current_Node);

        //Expand our current Node (look in all 8 directions)
        for (var new_Node_x = Math.max(0, current_Node.x-1); new_Node_x <= Math.min(columns-1, current_Node.x+1); new_Node_x++)
            for (var new_Node_y = Math.max(0, current_Node.y-1); new_Node_y <= Math.min(rows-1, current_Node.y+1); new_Node_y++)
            {
                if (board[new_Node_x][new_Node_y] == 0 //If the new Node is open
                    || (destination.x == new_Node_x && destination.y == new_Node_y)) //or the new Node is our destination
                {
                    //See if the Node is already in our closed list. If so, skip it.
                    var found_in_closed = false;
                    for (var i in closed)
                        if (closed[i].x == new_Node_x && closed[i].y == new_Node_y)
                        {
                            found_in_closed = true;
                            break;
                        }

                    if (found_in_closed)
                        continue;

                    //See if the Node is in our open list. If not, use it.
                    var found_in_open = false;
                    for (var i in open)
                        if (open[i].x == new_Node_x && open[i].y == new_Node_y)
                        {
                            found_in_open = true;
                            break;
                        }

                    if (!found_in_open)
                    {
                        var new_Node = new Node(new_Node_x, new_Node_y, closed.length-1, -1, -1, -1);

                        new_Node.g = current_Node.g + Math.floor(Math.sqrt(Math.pow(new_Node.x-current_Node.x, 2)+Math.pow(new_Node.y-current_Node.y, 2)));
                        new_Node.h = heuristic(new_Node, destination);
                        new_Node.f = new_Node.g+new_Node.h;

                        open.push(new_Node);
                    }
                }
            }
    }

    return [];
}

//An A* heurisitic must be admissible, meaning it must never overestimate the distance to the goal.
//In other words, it must either underestimate or return exactly the distance to the goal.
function heuristic(current_Node, destination)
{
    //Find the straight-line distance between the current Node and the destination. (Thanks to id for the improvement)
    //return Math.floor(Math.sqrt(Math.pow(current_Node.x-destination.x, 2)+Math.pow(current_Node.y-destination.y, 2)));
    var x = current_Node.x-destination.x;
    var y = current_Node.y-destination.y;
    return x*x+y*y;
}


/* Each Node will have six values: 
 X position
 Y position
 Index of the Node's parent in the closed array
 Cost from start to current Node
 Heuristic cost from current Node to destination
 Cost from start to destination going through the current Node
*/  

function Node(x, y, parent_index, g, h, f)
{
    this.x = x;
    this.y = y;
    this.parent_index = parent_index;
    this.g = g;
    this.h = h;
    this.f = f;
}