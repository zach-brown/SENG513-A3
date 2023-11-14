/* Zach Brown 
UCID: 30070355
Date: October 23 2023
SENG513 A2

Title: Quoridor Mini
Platform: Desktop
Genre: Strategy
Objective: First player to reach the other side of the board
Rules: 
This game is a twist on the classic board game quoridor. In quoridor mini, both players start on opposite
sides of a 5x5 board. They have to try and be the first player to reach their opponents side of the board.
Each player is given 8 walls and can use these walls by placing them down anywhere on the board as long as
they are not haning over the edge of the board. Players are not allowed to pass through these walls, and must
instead go around them. On a players turn they can either move on to a square that is orthogonal to them, place one 
of their walls down, or skip their turn and charge their barge power. When moving, if a player has the other player 
right in front of them, then they may leap frog that player. When placing walls, there must still be a legal path that 
still allows the other player to reach the opposite side of the board. If it completely blocks off the player, then the
 wall cannot be placed there. Once a player has run out of walls then they cannot use this action. Instead of moving or placing a wall, 
 the player can instead skip their turn and charge their barge power. Then, next turn or any turn after that they can use the barge attack on any wall
to permanently destroy it from the game. Once the power is used it needs to be charged again. A player can only have 1 barge power
at a time. Once a player reaches the other side of the board, then that player is crowned the winner

 

Game Mechanics:
    - Players can move their piece one space orthogonally
    - Players can place down a wall in a legal spot
    - Players can charge their barge power if they don't currently have it
    - Players can use their barge power if it was previously charged

*/





/*
create player with attributes: position, barge, color
set player turn to 1
init empty list for walls places
set tan pawn position to bottom row middle square
set white pawn position to top row middle square
create list from 1-25 for the 25 squares
set game over variable to false


call nextPlayerTurn()
*/
const playerList = [player1 = {position: 22, barge: 0, color: "yellow", walls: 4},
                    player2 = {position: 2, barge: 0, color: "blue", walls: 4}]

const wallList = [];
const squareList = ["1a", "1b", "1c", "1d", "1e",
                    "2a", "2b", "2c", "2d", "2e",
                    "3a", "3b", "3c", "3d", "3e",
                    "4a", "4b", "4c", "4d", "4e",
                    "5a", "5b", "5c", "5d", "5e"]
const brokenWalls = [];
playerTurn = -1;
gameOver = 0;
var square;
let bluePawn = new Image();
let yellowPawn = new Image();
bluePawn.src = "assets/bluepawn.png";
yellowPawn.src = "assets/yellowpawn.png";
bluePawn.classList.add("pawn");
yellowPawn.classList.add("pawn");
let greyPawn = new Image();
greyPawn.src = "assets/greypawn.png";
greyPawn.classList.add("greypawn");
greyPawn.setAttribute("onclick", "placePawn(this)")




nextPlayerTurn();

function nextPlayerTurn(){
    for(const player of playerList){
        square = document.getElementById(squareList[player.position]);
        if(player.color == "blue"){
            square.appendChild(bluePawn);
        }else{
            square.appendChild(yellowPawn);
        }
        
    }
    if(gameOver == 1){
        document.getElementById("turn").innerText = "Player "+(playerTurn+1)+" Wins!";
        return;
    }
    
    
    playerTurn++;
    playerTurn = playerTurn % 2;
    
    let pos = playerList[playerTurn].position;
    
    
    document.getElementById("turn").innerText = "Player "+(playerTurn+1)+"'s turn";
    document.getElementById("walls_left").innerText = "Walls: "+playerList[playerTurn].walls;
    if(playerList[playerTurn].barge == 1){
        document.getElementById("barge").style.display = "inline-block";
    }else{
        document.getElementById("barge").style.display = "none";
    }
    

}

function restartGame(){
    playerTurn = -1;
    var wallid, wall;
    while(wallList.length > 0){
        
        wallid = wallList.pop();
        wall = document.getElementById(wallid);
        wall.style.backgroundColor = "black";
        wall.setAttribute("onclick", "placeWall(this.id)");
        wall.setAttribute("onmouseover", "highlightWall(this.id)");
        wall.setAttribute("onmouseout", "removeHighlightWall(this.id)");
    }

    while(brokenWalls.length > 0){
        wallid = brokenWalls.pop();
        wall = document.getElementById(wallid);
        wall.classList.remove("broken");
        wall.setAttribute("onclick", "placeWall(this.id)");
        wall.setAttribute("onmouseover", "highlightWall(this.id)");
        wall.setAttribute("onmouseout", "removeHighlightWall(this.id)");

    }
    document.getElementById("bargehighlighted").style.display = "none";
    playerList[0].position = 22;
    playerList[0].barge = 0;
    playerList[0].walls = 4;
    playerList[1].position = 2;
    playerList[1].barge = 0;
    playerList[1].walls = 4;
    gameOver = 0;
    nextPlayerTurn();
}


function placeWall(id){

    var wall = document.getElementById(id);
    

    if(wallList.includes(id) || document.getElementById("bargehighlighted").style.display == "inline-block" || wall.classList.contains("broken") || gameOver == 1 || playerList[playerTurn].walls <= 0){
        return;
    }
    
    if(id.includes("wally")){   
        num = id.slice(5,6);
        num++;   
        id2 = "wally"+num+""+id.slice(6); 
        
    }else{
        num = id.charCodeAt(6);
        num++;   
        id2 = "wallx"+id.slice(5,6)+""+String.fromCharCode(num);
    }
    if(wallList.includes(id2)){
        return;
    }

    if(legalWallPlace(id, id2) && !document.getElementById(id2).classList.contains("broken")){
        var id2, num;
        wallList.push(id);
        wallList.push(id2);
        document.getElementById(id).style.backgroundColor = "yellow";
        document.getElementById(id2).style.backgroundColor = "yellow";
        playerList[playerTurn].walls--;
        nextPlayerTurn();
    }

    
    
}

function legalWallPlace(id, id2){
    
    const wallListCopy = [...wallList];
    wallListCopy.push(id);
    wallListCopy.push(id2);
    let pos = playerList[0].position;
    let pos2 = playerList[1].position;
    
    return dfs(pos, "north", wallListCopy) && dfs(pos2, "south", wallListCopy);
    
}

function dfs(pos, direction, list){
    const stack = [pos];
    const visited = new Set();

    while(stack.length){
        
        let square = stack.pop();
        if(direction == "north"){
            if(square <= 5){
                return true;
            }
        }else{
            if(square >=20){
                return true;
            }
        }
        if(!visited.has(square)){
            visited.add(square);    
            let directions = legalMove(square, list);
            
            for(d of directions){
                if(d == "n"){ 
                    stack.push(square-5);     
                }else if(d == "e"){
                    stack.push(square+1);     
                }else if(d == "s"){
                    stack.push(square+5);     
                }else{
                    stack.push(square-1);  
                }
            }
        }
    }
    return false;

}

function possibleSquares(pos){
    var moveList = legalMove(pos, wallList);
    var squares = [];

    for(const move of moveList){
        if(move == "n"){ 
            squares.push(squareList[pos-5]);     
        }else if( move == "e"){
            squares.push(squareList[pos+1]);     
        }else if(move == "s"){
            squares.push(squareList[pos+5]);     
        }else{
            squares.push(squareList[pos-1]);  
        }
 
    }
    return squares;
}


function placePawn(element){
    
    /*
    check players turn
    check if there is a legal move for the current position of pawn using legalMove(player #)
    if click is not in legal position to move
        return

    update player position to new square
    update css of pawn location
    update player turn to next player
    check if player has won and if they have then set game_over to true
    callNextPlayerTurn()
    */
    
    let pid = element.parentElement.id;
    let pos = squareList.indexOf(pid)
    playerList[playerTurn].position = pos;
    greyPawn.style.display = "none";
    if((pos <= 5 && playerTurn == 0) || (pos >= 20 && playerTurn == 1)){
        gameOver = 1;
    }
    nextPlayerTurn();
}

function charge(){
    playerList[playerTurn].barge = 1;
    const frames = document.getElementsByClassName("chargeanimation");
    const frameCount = frames.length;
    console.log(frameCount);
    let i = 0
    let x = setInterval(function () { 
        frames[i].style.display = "none";
        frames[++i].style.display = "block";
        if(i > 8){
            frames[i].style.display = "none";
            clearInterval(x);
        }
        }, 100, 100);
    nextPlayerTurn();

}

function barge(id){
    
    if(document.getElementById("bargehighlighted").style.display == "inline-block"){
        document.getElementById("bargehighlighted").style.display = "none"
        for(const wall of wallList){
            var w = document.getElementById(wall);
            if(w.classList.contains("bargewall")){
                w.classList.remove("bargewall");
                w.removeAttribute("onclick");
                w.removeAttribute("onmouseover");
                w.removeAttribute("onmouseout");
            }
            
        }
        
        return;
    }
    
    document.getElementById("bargehighlighted").style.display = "inline-block";
   
    for(const wall of wallList){
        var w = document.getElementById(wall);
        w.classList.add("bargewall");
        w.setAttribute("onclick", "breakWall(this.id)");
        w.setAttribute("onmouseover", "redWall(this.id)");
        w.setAttribute("onmouseout", "yellowWall(this.id)");
    }
    

}

function breakWall(id){
    
    for(const wall of wallList){
        var w = document.getElementById(wall);
        w.classList.remove("bargewall");
        w.removeAttribute("onclick");
        w.removeAttribute("onmouseover");
        w.removeAttribute("onmouseout");
        
        
    }
    playerList[playerTurn].barge = 0;
    wallList.splice(wallList.indexOf(id), 1);
    brokenWalls.push(id);
    var wall = document.getElementById(id);
    console.log(id +" "+wall);
    wall.classList.add("broken");
    wall.style.backgroundColor = "black";
    document.getElementById("bargehighlighted").style.display = "none";
    const frames = document.getElementsByClassName("wallanimation");
    const frameCount = frames.length;
    let i = 0;
    let x = setInterval(function () { 
    frames[i].style.display = "none";
    frames[++i].style.display = "block";
    if(i > 17){
        frames[i].style.display = "none";
        clearInterval(x);
    }
    }, 100, 100);
    nextPlayerTurn();
 
}

function legalMove(pos, list){
    const directions = [];
    
    if((pos - 5) >= 0){
        
        if(!list.includes("wallx"+squareList[pos-5]+"")){
            directions.push("n");
        }
    }
    if(pos % 5 != 0){
        if(!list.includes("wally"+squareList[pos-1]+"")){
            directions.push("w");
        }
    }
    if((pos+5) <= 24){
        if(!list.includes("wallx"+squareList[pos]+"")){
            directions.push("s");
        }
    }
    if(pos % 5 != 4){
        if(!list.includes("wally"+squareList[pos]+"")){
            directions.push("e");
        }
    }
    
    /*
    initialize list of 4 directions
    get players position
    check all 4 directions from player
    if there is a wall or border in way of direction then remove that direction from list
    if there is a pawn in one direction, check if the next square after that is a wall or border
        then remove direction if thats true
    return list of positions player can move
    */
   return directions;
}

function displayCharge(){
    
    document.getElementById("bargedisabled").style.display = "none";
}

function displayDisabled(){
    
    document.getElementById("bargedisabled").style.display = "inline-block";
}

//changed implementation of how walls turn red when cursor goes over them so it 
function redWall(id){
    document.getElementById(id).style.backgroundColor = "red";
}

function yellowWall(id){
    document.getElementById(id).style.backgroundColor = "yellow";
}

//added this function while testing game as it makes it easier for players to see where they can move to next
function possibleLocation(element){
    if(document.getElementById("bargehighlighted").style.display == "inline-block"){
        return;
    }
    var squares = possibleSquares(playerList[playerTurn].position);
    
    if (squares.includes(element.id)){
        element.appendChild(greyPawn);
        greyPawn.style.display = "inline-block";
    }
    
}
function removePosLocation(){
    greyPawn.style.display = "none";
    
}

function highlightWall(id){
    var num, id2;
    if(wallList.includes(id) || playerList[playerTurn].walls <= 0){
        return;
    }
    if(id.includes("wally")){   
        
        num = id.slice(5,6);
        num++;   
        id2 = "wally"+num+""+id.slice(6); 
        
    }else{
        
        num = id.charCodeAt(6);
        num++;   
        id2 = "wallx"+id.slice(5,6)+""+String.fromCharCode(num);
    }
    if(!legalWallPlace(id, id2) || document.getElementById(id2).classList.contains("broken")){
        return;
    }
    if(!wallList.includes(id2)){
        document.getElementById(id).style.backgroundColor = "grey";
        document.getElementById(id2).style.backgroundColor = "grey";
    }
}

function removeHighlightWall(id){
    if(wallList.includes(id)){
        return;
    }
    var id2, num;
    if(id.includes("wally")){

        num = id.slice(5,6);
        num++;   
        id2 = "wally"+num+""+id.slice(6);
       
    }else{
        num = id.charCodeAt(6);
        num++;
        id2 = "wallx"+id.slice(5,6)+""+String.fromCharCode(num);
 
    }
    if(!wallList.includes(id2)){
        document.getElementById(id).style.backgroundColor = "black";
        document.getElementById(id2).style.backgroundColor = "black";
    }
}

function helpMenu(){
    
    for(element of document.getElementsByClassName("menu")){
        document.getElementById(element.id).style.display = "block";
    }
    
    //set help menu display to block
    //set x display to block
}

function closeMenu(){
    for(element of document.getElementsByClassName("menu")){
        document.getElementById(element.id).style.display = "none";
    }
    //set help menu display to none
    //set x display to none
}