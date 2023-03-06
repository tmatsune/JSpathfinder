function depthFirstSearch(grid, node, goal){
    for(var i=0; i < ROWS; i++){
        grid[i].forEach(node => {
            node.updateNeightbors(grid)
        })
    }
    var count = 0

    DFSstack.append(node)
    while(DFSstack.length > 0 ){//while loop 
        let currNode = DFSstack.peek()
        DFSstack.remove()
        if(currNode === goal){
            break 
        }
        currNode.neighbors.forEach(neighbor => {
            count += 1
            if(neighbor.visited === false){
                neighbor.visited = true
                neighbor.selected = true
                setTimeout(() => {
                    neighbor.makeOpenNode1()
                }, count * 3.4)
                setTimeout(() => {
                    neighbor.makeOpenNode2()
                }, count * 3.8)
                neighbor.neighbors.forEach(node => {
                    DFSstack.append(node)
                })
            }
        })

    }

}