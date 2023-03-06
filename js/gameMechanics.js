
window.addEventListener('load', function(){
    // create canvas and get context
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d');

    canvas.height = 800
    canvas.width = 800

    const ROWS = 20
    const COLS = 20
    const nodeWidth = 40

var startingNode = null
var endingNode = null
var testOpenSet = []
var testClosedSet = []
var dijkstraSet = []
var DFSstack = new Stack()


class MouseClickHandler{
    constructor(){
        this.keys = []
    }
    getMousePos(){
        canvas.addEventListener("click", function(event){
        let posX = Math.floor(event.offsetX / nodeWidth);//division
        let posY = Math.floor(event.offsetY / nodeWidth);
        //let curr = mainGrid[posY][posX]
        if(startingNode === null){
            mainGrid[posY][posX].selected = true
            mainGrid[posY][posX].makeStartingNode()
            startingNode = mainGrid[posY][posX]
            //this.start = mainGrid[posY][posX]
        }else if(endingNode === null){
            mainGrid[posY][posX].selected = true
            mainGrid[posY][posX].makeEndingNode()
            endingNode = mainGrid[posY][posX]
        }//else if(startingNode !== null && endingNode !== null){
            //mainGrid[posY][posX].selected = true
            //mainGrid[posY][posX].makeBarrierNode()
        //}
    })
        canvas.addEventListener("mousedown", function(event){
        let posX = Math.floor(event.offsetX / nodeWidth);
        let posY = Math.floor(event.offsetY / nodeWidth);
        if(startingNode !== null && endingNode !== null &&
            mainGrid[posY][posX] !== startingNode && mainGrid[posY][posX] !== endingNode){
            mainGrid[posY][posX].selected = true
            mainGrid[posY][posX].makeBarrierNode()
        }
        })
    }
    getKeyInput(){
        window.addEventListener('keydown', e => {
            switch (e.key){
                case 'a':
                    if(startingNode !== null && endingNode !== null)
                    aStarAlgorithm(startingNode, endingNode, mainGrid)
                    break
                case 'd':
                    if(startingNode !== null && endingNode !== null)
                    dijkstraAlgorithm(mainGrid, startingNode, endingNode)
                    break
                case 'r':
                    restart()
            }

        })
    }

}

function aStarAlgorithm(start, goal, grid){
    for(var i=0; i < ROWS; i++){
        grid[i].forEach(node => {
            node.updateNeightbors(grid)
        })
    }
    var count = 0
    testOpenSet.push(start)
    var pathCount = 1

    var cameFrom = {}

    start.gScore = 0
    start.fScore = getHeu(start, goal)

    while(testOpenSet.length > 0){

        var currNode = testOpenSet[0]//start off with start Node
        let currIndex = 0
    
        for(const [index, element] of testOpenSet.entries()){
            // looks for node with lowest fScore, if found make set it to currNode
            // if fScore of item in lis is less than fScore of currNode, make priority
            if(element.fScore < currNode.fScore){//getHeu(currNode, goal), fScore[currNode.id]
                currNode = element
                currIndex = index
            }
        }
        
        testOpenSet.splice(currIndex,1)// removes current node from openSet
        testClosedSet.push(currNode)

        if(currNode === goal){// if goal is found stop loop 
            setTimeout(() => {
            //  reconstructPath(cameFrom, currNode)
                pathNodes = reconstructPath(cameFrom, currNode)
                pathNodes = pathNodes.reverse()
                index = 0
                pathNodes.forEach(node => {
                    if(index+1 >= pathNodes.length){
                        if(goal.y < node.y){
                            node.direction = 2
                        }else if(goal.x < node.x){
                            node.direction = 4
                        }else if(goal.y > node.y){
                            node.direction = 3
                        }
                    }else{
                        if(pathNodes[index + 1].y < node.y){
                            node.direction = 2
                        }else if(pathNodes[index + 1].y > node.y){
                            node.direction = 3
                        }else if(pathNodes[index + 1].x > node.x){
                            node.direction = 1
                        }else if(pathNodes[index + 1].x < node.x){
                            node.direction = 4
                        }
                    }
                    index += 1
                    start.makeStartingNode()
                    goal.makeEndingNode()
                    pathCount += 4
                    setTimeout(() => {
                        node.selected = true
                        node.makePathNode1()
                    }, pathCount * 20)
                    setTimeout(() => {
                        node.selected = true
                        node.makePathNode()
                    }, pathCount * 24)
                    })
                start.makeStartingNode()
                goal.makeEndingNode()
            }, count * 8.2)
            break
        }
        
        currNode.neighbors.forEach(neighbor => {
            count += 1
            tentativeGscore = currNode.gScore + 1
            if(tentativeGscore < neighbor.gScore){//Infinity
                cameFrom[neighbor.id] = currNode
                neighbor.gScore = tentativeGscore
                neighbor.fScore = tentativeGscore + getHeu(neighbor, goal)
                if(!testOpenSet.includes(neighbor)){
                    testOpenSet.push(neighbor)
                    setTimeout(() => {
                        neighbor.selected = true
                        neighbor.makeOpenNode1()
                    }, count * 6.8)
                    setTimeout(() => {
                        neighbor.selected = true
                        neighbor.makeOpenNode2()
                    }, count * 7)
                    setTimeout(() => {
                        neighbor.selected = true
                        neighbor.makeOpenNode()
                    }, count * 7.2)
                    setTimeout(() => {
                        neighbor.selected = true
                        neighbor.makeSearchedNode()
                    }, count * 7.4)
                }
            }
        })
    }
    //console.log(grid)
    return true
    
}
function reconstructPath(cameFrom, current){
    //console.log(current.id)
    var count = 0
    var nodesPath = []
    while(cameFrom.hasOwnProperty(current.id)){
        current = cameFrom[current.id]
        //current.makePathNode()
        nodesPath.push(current)
    }
    return nodesPath
}



function getHeu(node1, node2){ // esitamtes distance from node to ending Node
    //const dx = node1.row - node2.row
    //const dy = node1.col - node2.col
    //const distance = Math.sqrt(dx * dx + dy * dy)
    let distance = Math.abs(node1.row - node2.row) + Math.abs(node1.col - node2.col)
    return distance
}

function dijkstraAlgorithm(graph, source, goal){
    cameFrom = {}
    for(var i=0; i < ROWS; i++){
        graph[i].forEach(node => {
            node.updateNeightbors(graph)
        })
    }

    source.fScore = 0
    source.prev = source.id

    for(var i=0; i<graph.length; i++){
        for(item of graph[i]){
            dijkstraSet.push(item)
        }
    }
    var count = 0
    var pathCount = 1
    while(dijkstraSet.length > 0){//while(dijkstraSet.length > 0)

        let currNode = dijkstraSet[0]
        let currIndex = 0
        // get node with shortest distance
        for(const [index, value] of dijkstraSet.entries()){
            if(value.fScore < currNode.fScore){//value.fScore < currNode.fScore
                currNode = value
                currIndex = index
            }
        }

        dijkstraSet.splice(currIndex,1)

        if (currNode === goal){
            setTimeout(() => {
                pathNodes = reconstructPath(cameFrom, currNode)
                pathNodes = pathNodes.reverse()
                index = 0

                pathNodes.forEach(node => {
                    if(index+1 >= pathNodes.length){
                        if(goal.y < node.y){
                            node.direction = 2
                        }else if(goal.x < node.x){
                            node.direction = 4
                        }else if(goal.y > node.y){
                            node.direction = 3
                        }
                    }else{
                        if(pathNodes[index + 1].y < node.y){
                            node.direction = 2
                        }else if(pathNodes[index + 1].y > node.y){
                            node.direction = 3
                        }else if(pathNodes[index + 1].x > node.x){
                            node.direction = 1
                        }else if(pathNodes[index + 1].x < node.x){
                            node.direction = 4
                        }
                    }
                    index += 1
                    source.makeStartingNode()
                    goal.makeEndingNode()
                    pathCount += 4
                    setTimeout(() => {
                        node.makePathNode1()
                    }, pathCount * 20)
                    setTimeout(() => {
                        node.makePathNode()
                    }, pathCount * 24)
                    })
                source.makeStartingNode()
                goal.makeEndingNode()
            }, count * 4.5)
            break
        }
        // for each neighbor of currNode
        //console.log(currNode)
        currNode.neighbors.forEach(neighbor => {
            count += 1
            alt = currNode.fScore + 1
            if (alt < neighbor.fScore){
                neighbor.fScore = alt
                neighbor.prev = currNode.id
                cameFrom[neighbor.id] = currNode
                setTimeout(() => {
                    neighbor.selected = true
                    neighbor.makeOpenNode1()
                }, count * 3.8)
                setTimeout(() => {
                    neighbor.selected = true
                    neighbor.makeOpenNode2()
                }, count * 4)
                setTimeout(() => {
                    neighbor.selected = true
                    neighbor.makeOpenNode()
                }, count * 4.2)
                setTimeout(() => {
                    neighbor.selected = true
                    neighbor.makeSearchedNode()
                }, count * 4.4)
            }
        })
    }

}

function reconstructDFS(goal){
    var pathNodes = []
    let current = goal
    while(current !== null){
        //pathNodes.unshift(current)
        pathNodes.push(current)
        current = current.prev
    }
    return pathNodes
}

function depthFirstSearch(grid, start, goal){
    for(var i=0; i < ROWS; i++){
        grid[i].forEach(node => {
            node.updateNeightbors(grid)
        })
    }
    var count = 0
    var pathCount = 1
    DFSstack.append(start)
    var cameFrom = []
    stack = []
    //stack.push(start)
    while( DFSstack.length > 0 ){//while loop 
        let currNode = DFSstack.peek()
        DFSstack.remove()
        //let currNode = stack.pop()
        if(currNode.visited === false || currNode === start){
            currNode.visited = true
            cameFrom.push(currNode)
        }
        //currNode.visited = true
        if(currNode === goal){
            setTimeout(() => {
                index = 0
                cameFrom = reconstructDFS(goal)
                cameFrom = cameFrom.reverse()
                cameFrom.forEach(node => {
                    if(index+1 >= cameFrom.length){
                        if(goal.y < node.y){
                            node.direction = 2
                        }else if(goal.x < node.x){
                            node.direction = 4
                        }else if(goal.y > node.y){
                            node.direction = 3
                        }
                    }else{
                        if(cameFrom[index + 1].y < node.y){
                            node.direction = 2
                        }else if(cameFrom[index + 1].y > node.y){
                            node.direction = 3
                        }else if(cameFrom[index + 1].x > node.x){
                            node.direction = 1
                        }else if(cameFrom[index + 1].x < node.x){
                            node.direction = 4
                        }
                    }
                    index += 1
                    start.makeStartingNode()
                    goal.makeEndingNode()
                    pathCount += 1
                    setTimeout(() => {
                        node.makePathNode1()
                    }, pathCount * 20)
                    setTimeout(() => {
                        node.makePathNode()
                    }, pathCount * 22)
                    })
                start.makeStartingNode()
                goal.makeEndingNode()
            }, count * 4.5)
            break 
        }
        setTimeout(() => {
            currNode.selected = true
            currNode.makeOpenNode1()
        }, count * 3.5)
        setTimeout(() => {
            currNode.makeOpenNode2()
        }, count * 3.6)
        setTimeout(() => {
            currNode.makeOpenNode()
        }, count * 3.7)
        setTimeout(() => {
            currNode.makeSearchedNode()
        }, count * 3.8)
        
        currNode.neighbors.forEach(neighbor => {
            count += 1
            if(neighbor.visited === false){
                DFSstack.append(neighbor)
                neighbor.prev = currNode
                //stack.push(neighbor)
            }
        })


    }

}

var mazeStack = new Stack()
function mazeGeneratorDFS(grid, start){
    for(var i=0; i < ROWS; i++){
        grid[i].forEach(node => {
            node.updateNeightbors(grid)
        })
    }
    var count = 0
    var pathCount = 1
    mazeStack.append(start)
    while (stack.length > 0){
        let currNode = mazeStack.peek()
        mazeStack.remove() 
        if(currNode.visited === false || currNode === start){
            currNode.visited = true
        }
        randNode = null
        let rand = Math.floor(Math.random() * currNode.neighbors.length)
        let randNode = currNode.neighbors[rand]
        randNode.prev = currNode
        mazeStack.append(randNode)

    }

}

function makeGrid(){
    let grid = []
    for(var i=0; i<ROWS; i++){
        grid.push([])
        for(var j=0; j<COLS; j++){// j is horizontal(cols), i is vertical(rows)
            let x = j * nodeWidth
            let y = i * nodeWidth
            var node = new Node(nodeWidth, x, y, i, j)
            grid[i].push(node)
        }
    }
    return grid
}
function drawGrid(grid, context){
    for(var i=0; i<ROWS; i++){
        for(var j=0; j<COLS; j++){
            grid[j][i].draw(context)
        }
    }
}
// ---------- make grid -------------//
var mainGrid = makeGrid()

// ---------- handle user inputs -------------//
const mouseHandler = new MouseClickHandler()
pos = mouseHandler.getMousePos()
mouseHandler.getKeyInput()

function restart(){
    mainGrid = makeGrid()
    startingNode = null
    endingNode = null
    testOpenSet = []
    testClosedSet = []
    dijkstraSet = []
}   
var astarButton = this.document.getElementById('astar')
astarButton.onclick = function(){
    if(startingNode !== null && endingNode !== null)
    aStarAlgorithm(startingNode, endingNode, mainGrid)
}
var dijButton = this.document.getElementById('dijkstra')
dijButton.onclick = function(){
    if(startingNode !== null && endingNode !== null)
    dijkstraAlgorithm(mainGrid, startingNode, endingNode)
}
var dfsButton = this.document.getElementById('dfs')
dfsButton.onclick = function(){
    if(startingNode !== null && endingNode !== null)
    depthFirstSearch(mainGrid, startingNode, endingNode)
}
var resetButton = this.document.getElementById('reset')
resetButton.onclick = function(){
    restart()
}



let lastTime = 1000
drawGrid(mainGrid, ctx)
function animate(timeStamp){
    const deltaTime = timeStamp - lastTime
    lastTime = timeStamp
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawGrid(mainGrid, ctx)
    //drawImage(ctx)
    window.requestAnimationFrame(animate)
}

animate(0)
})
