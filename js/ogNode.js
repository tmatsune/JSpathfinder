var image = document.getElementById("arrowImage")
function drawImage(context){
    context.drawImage(image, 100, 100, 20, 20)
}

class Node{
    constructor(width, x, y, row, col){
        this.width = width
        this.color = "white"
        this.x = x
        this.y = y
        this.row = row
        this.col = col
        this.selected = false
        this.id = [row , col]//[row , col]
        this.neighbors = []
        this.rows = 40
        this.gScore = Infinity
        this.fScore = Infinity
        this.prev = null
        this.image = document.getElementById("arrowImage")
        this.direction = 1
    }
    isStartingNode(){
        return this.color === "red"
    }
    isEndingNode(){
        return this.color === "purple"
    }
    isUndefinedNode(){
        return this.color === "white"
    }
    isSearchingNode(){
        return this.color === "blue"
    }
    isBarrierNode(){
        return this.color === "black"
    }
    ispathNode(){
        return this.color === "Gold"
    }
    makeStartingNode(){
        this.color = "red"
    }
    makeEndingNode(){
        this.color = 'DeepPink'
    }
    makeBarrierNode(){
        this.color = "black"
    }
    makePathNode1(){
        //this.x += 4
        //this.y += 4
        //this.width -= 8
        this.color = "Gold"
    }
    makePathNode(){
        //this.x -= 4
        //this.y -= 4
        //this.width += 8
        this.color = "Yellow"
    }
    makeSearchedNode(){//serachded Node
        this.x -= 3
        this.y -= 4
        this.width += 8
        this.color = "DeepSkyBlue"
    }
    makeOpenNode(){//searched node
        this.x += 3
        this.y += 4
        this.width -= 8
        this.color = "SpringGreen"
    }
    makeOpenNode1(){
        this.x += 3
        this.y += 4
        this.width -= 8
        this.color = "blue"
    }
    makeOpenNode2(){
        this.x -= 3
        this.y -= 4
        this.width += 8
        this.color = "yellow"
    }
    draw(context){
        if(this.selected === false){
            context.strokeStyle = "black"
            context.strokeRect(this.x, this.y, this.width, this.width)
        }else if(this.ispathNode() === true){
            if(this.direction === 1){
                this.image = document.getElementById("arrowImage")
            }else if(this.direction === 2){
                this.image = document.getElementById("arrowImageUp")
            }else if(this.direction === 3){
                this.image = document.getElementById("arrowImageDown")
            }else if(this.direction === 4){
                this.image = document.getElementById("arrowImageLeft")
            }else if(this.direction === 0){
                context.fillStyle = this.color
                context.fillRect(this.x + 1, this.y + 1, this.width-2, this.width- 2)
            }
            context.drawImage(this.image, this.x, this.y, 20, 20)
        }else{
            context.fillStyle = this.color
            context.fillRect(this.x + 1, this.y + 1, this.width-2, this.width- 2)
        }
    }
    updateNeightbors(grid){
        if(this.row > 0 && grid[this.row-1 ][this.col].isBarrierNode() === false){
            var up = grid[this.row - 1][this.col]
            this.neighbors.push(up)
        }
        if(this.row + 1 < this.rows  && grid[this.row+1][this.col].isBarrierNode() === false){
            var down = grid[this.row + 1][this.col]
            this.neighbors.push(down)
        }   
        if(this.col >  0 && grid[this.row][this.col - 1].isBarrierNode() === false){
            var left = grid[this.row][this.col - 1]
            this.neighbors.push(left)
        }
        if(this.col + 1 < this.rows && grid[this.row][this.col + 1].isBarrierNode() === false){
            var right = grid[this.row][this.col + 1]
            this.neighbors.push(right)
        }
    
    }

}
class QueueNode{
    constructor(data = null){
        this.data = data
        this.next = null
    }
}

class Queue{
    constructor(){
        this.first = null
        this.last = null
        this.length = 0
    }
    append(value){
        var newNode = new QueueNode(value)
        if(this.length === 0){
            this.first = newNode
            this.last = newNode
            this.length += 1
        }else{
            this.last.next = newNode
            this.last = newNode
            this.length += 1
        }
    }
    remove(){
        if(this.first === this.last){
            this.last = null
            this.first = null
            return null
        }else{
            this.first = this.first.next
            this.length -= 1
        }
    }
    peek(){
        if(this.first !== null){
            console.log(this.first.data)
        }else{
            console.log(this.first)
        }
    }
    traverse(){

    }

}
var queue = new Queue()

const ls = ["terence", "miyuki", "hiroshi", "dad", "mom"]
for(const [index, element] of ls.entries()){
    console.log(index, element)
}
ls.splice(0,1)
console.log(ls)

if(!ls.includes("miyuki")){
    console.log("in list")
}
const dict = {joe:1, bob:2, bill:3}
if(Object.keys(dict).includes('joe')){
    //console.log("sdfdsf")
}
items = [1, 2, 3, 4, 5,6 ]