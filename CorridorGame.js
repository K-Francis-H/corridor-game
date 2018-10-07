function CorridorGame(){

   //initialize draw stuff
   var canvas = document.getElementById("canvas");
   var ctx = canvas.getContext("2d");
   console.log(ctx);
   var tileWidth = canvas.width/CorridorGame.SIZE;
   var wallWidth = tileWidth * CorridorGame.WALL_WIDTH;
   var innerTileWidth = tileWidth - 2 * wallWidth;
   //var playerRadius = tileWidth/2;

   var wood = document.getElementById("wood");
   var darkWood = document.getElementById("dark-wood");

   //TODO initialize websocket stuff

   //TODO initialize button listeners
   var moveType = CorridorGame.PAWN_MOVE;

   var controlDiv = document.getElementById("player-1-controls");
   var p1PawnButton = document.getElementById("pawn-button");
   var p1WallButton = document.getElementById("wall-button");
   p1PawnButton.onclick = function(){
      moveType = CorridorGame.PAWN_MOVE;
   }
   p1WallButton.onclick = function(){
      console.log(players[currentPlayerIndex].wallsLeft);
      if(players[currentPlayerIndex].wallsLeft > 0)
         moveType = CorridorGame.WALL_MOVE;
   }



   //initialize game stuff
   var grid = [];
   for(var i=0; i < CorridorGame.SIZE; i++){
      grid[i] = [];
      for(var j=0; j < CorridorGame.SIZE; j++){
         grid[i][j] = new CorridorTile();
      }
   }

   var numPlayers = 3;//3,4 TODO have this set by the constructor
   var players = [];
   for(var i=0; i < numPlayers; i++){
      players[i] = new CorridorPlayer(CorridorGame.STARTS[i], Math.floor(CorridorGame.WALLS/numPlayers)); //maybe have colors or something, and player type (local, AI, networked)
      //TODO set player position
   }

   var currentPlayer = players[0];
   var currentPlayerIndex = 0;
   
   console.log(players);
   //var currentPlayer = player[0]; //first player to go

   var move = new CorridorMove();

   //class for highlighting active move
   function CorridorMove(){
      var boardCoords = []; //an array of 3 coords each : x, y, wall (left, right, up, down)

      var pawnMoveCoords = null;

      CorridorMove.prototype.setPawnMove = function(mousePos){
         //relative to window
         var x = mousePos.clientX;
         var y = mousePos.clientY;

         //relative to canvas
         var rect = canvas.getBoundingClientRect();
         x = x - rect.left; //.x, .y only available in firefox
         y = y - rect.top;

         //player grid position
         var playerPos = players[currentPlayerIndex].position;

         //get mouse position in grid coords
         var gridX = Math.floor(x / tileWidth);
         var gridY = Math.floor(y / tileWidth);
         

         console.log(grid[gridX][gridY].isWall(CorridorTile.RIGHT));
         console.log(playerPos.x - gridX);
         console.log(playerPos.y - gridY);
         //now see if current place is available move
         console.log( (playerPos.y - gridY) + " " + playerPos.x - gridX + " " + grid[gridX][gridY].isWall(CorridorTile.RIGHT) );
         console.log("x: "+gridX+" y: "+gridY);
         //TODO allow for jumping of pawns if possible (clear space 2 in front, side, behind no in between walls)

         //check up
         if(playerPos.x - gridX === 0 && playerPos.y - gridY === 1 && !grid[gridX][gridY].isWall(CorridorTile.DOWN) ){
		pawnMoveCoords = {x : gridX, y : gridY};
                return;
         }
         //check down
         if(playerPos.x - gridX === 0 && playerPos.y - gridY === -1 && !grid[gridX][gridY].isWall(CorridorTile.UP) ){
		pawnMoveCoords = {x : gridX, y : gridY};
		 return;
         }
	 //check left
	 if(playerPos.y - gridY === 0 && playerPos.x - gridX === 1 && !grid[gridX][gridY].isWall(CorridorTile.RIGHT) ){
		pawnMoveCoords = { x : gridX, y : gridY};
		 return;
         }
         //check right
	 if(playerPos.y - gridY === 0 && playerPos.x - gridX === -1 && !grid[gridX][gridY].isWall(CorridorTile.LEFT) ){
		pawnMoveCoords = { x : gridX, y : gridY};
		 return;
         } 

	pawnMoveCoords = null;
         
      }
   
      CorridorMove.prototype.setWallMove = function(mousePos){
         //relative to window
         var x = mousePos.clientX;
         var y = mousePos.clientY;
         //console.log(x+" "+y);

         //get rect!
         var rect  = canvas.getBoundingClientRect();
         //console.log(rect);
         //real relative coords
         x = x - rect.left;
         y = y - rect.top;

         //first find out what square we are in
         var gridX = Math.floor(x / tileWidth);
         var gridY = Math.floor(y / tileWidth);
         console.log(gridX+" "+gridY);
         //TODO not exactly being too strict on the top and bottom
         //if(gridX === 0 || gridX === CorridorGame.SIZE-1 || gridY === 0 || gridY === CorridorGame.SIZE-1)
         //   return;

         //now get coords relative to our square
         var squareX = x - gridX * tileWidth;
         var squareY = y - gridY * tileWidth;
         console.log(squareX+" "+squareY);

         //now use your logic...
         
         //find closest wall
         var closestWall = getClosestWall(squareX, squareY);
         console.log(closestWall);

         //now decide which four walls to pick...
         //if up or down we pick horizontal
	 if(closestWall === CorridorTile.UP){
            //now pick based on something
            //we are bottom left corner.. move up, right, down
            boardCoords[0] = {x : gridX, y : gridY, wall : closestWall};
            boardCoords[1] = {x : gridX, y : gridY-1, wall : CorridorTile.DOWN};
            boardCoords[2] = {x : gridX+1, y : gridY-1, wall : CorridorTile.DOWN};
            boardCoords[3] = {x : gridX+1, y : gridY, wall : closestWall};
         }
         else if(closestWall === CorridorTile.DOWN){
            boardCoords[0] = {x : gridX, y : gridY, wall : closestWall};
            boardCoords[1] = {x : gridX, y : gridY+1, wall : CorridorTile.UP};
            boardCoords[2] = {x : gridX+1, y : gridY+1, wall : CorridorTile.UP};
            boardCoords[3] = {x : gridX+1, y : gridY, wall : closestWall};
         }
         //if left or right we pick vertical
         else if(closestWall === CorridorTile.LEFT){
            boardCoords[0] = {x : gridX, y : gridY, wall : closestWall};
            boardCoords[1] = {x : gridX, y : gridY+1, wall: closestWall};
            boardCoords[2] = {x : gridX-1, y : gridY+1, wall : CorridorTile.RIGHT};
            boardCoords[3] = {x : gridX-1, y : gridY, wall : CorridorTile.RIGHT};
         }
         else{//RIGHT
	    boardCoords[0] = {x : gridX, y : gridY, wall : closestWall};
            boardCoords[1] = {x : gridX, y : gridY+1, wall : closestWall};
            boardCoords[2] = {x : gridX+1, y : gridY+1, wall : CorridorTile.LEFT};
            boardCoords[3] = {x : gridX+1, y : gridY, wall : CorridorTile.LEFT};
         }


      }

	 CorridorMove.prototype.getBoardCoords = function(){
            return boardCoords;
         } 

         CorridorMove.prototype.getPawnMoveCoords = function(){
            return pawnMoveCoords;
         }

         CorridorMove.prototype.clearMove = function(){
            boardCoords = [];
            pawnMoveCoords = null;
         }

         
      
      function getClosestWall(squareX, squareY){
         //the distance formula!
         //or just compare x,y vals... faster thaan Math.sqrt
         if(squareX < tileWidth*0.5){
            //we are left
            //now check if in the middle 50%
            if(squareY > tileWidth*0.25 && squareY < tileWidth*0.75){
               //return left
               return CorridorTile.LEFT
            }
            else if(squareY < tileWidth * 0.25){
               return CorridorTile.UP;
            }
            else{
               return CorridorTile.DOWN;
            }
         }
         else{
            if(squareY > tileWidth*0.25 && squareY < tileWidth*0.75){
               //return left
               return CorridorTile.RIGHT
            }
            else if(squareY < tileWidth * 0.25){
               return CorridorTile.UP;
            }
            else{
               return CorridorTile.DOWN;
            }
      }
   }
}

   var draw = function(){
      //draw grid and walls
      var x, y, localX, localY; //x,y are global grid offset for a grid square, localX, localY are local to a grid square
      for(var i=0; i < CorridorGame.SIZE; i++){
	for(var j=0; j < CorridorGame.SIZE; j++){
	   //get pixel offset
           x = i * tileWidth;
           y = j * tileWidth;
	   //TODO draw 1/8 all around border (black no wall, white if wall), draw center gray
           //first draw whole tile gray because it may be overwritten
           ctx.fillStyle=CorridorGame.GRAY;
           ctx.drawImage(wood, x, y, x + tileWidth, y + tileWidth);//fillRect(x, y, x + tileWidth, y + tileWidth);
         

           //draw up wall
           if(grid[i][j].isWall(CorridorTile.UP) )
	      ctx.fillStyle=CorridorGame.WHITE;
           else
              ctx.fillStyle=CorridorGame.BLACK;
           ctx.fillRect(x,y, tileWidth, wallWidth);

           //draw down wall
           if(grid[i][j].isWall(CorridorTile.DOWN) )
	      ctx.fillStyle=CorridorGame.WHITE;
           else
              ctx.fillStyle=CorridorGame.BLACK;
           ctx.fillRect(x,y + tileWidth - wallWidth, tileWidth, wallWidth);     

           //draw left wall
           if(grid[i][j].isWall(CorridorTile.LEFT) )
	      ctx.fillStyle=CorridorGame.WHITE;
           else
              ctx.fillStyle=CorridorGame.BLACK;
           ctx.fillRect(x,y, wallWidth, tileWidth);

           //draw left wall
           if(grid[i][j].isWall(CorridorTile.RIGHT) )
	      ctx.fillStyle=CorridorGame.WHITE;
           else
              ctx.fillStyle=CorridorGame.BLACK;
           ctx.fillRect(x + tileWidth - wallWidth, y, wallWidth, tileWidth);
           
	}
      }

      //draw players over top
      for(var i=0; i < numPlayers; i++){
         ctx.fillStyle="#1f3";
         for(var j=Math.floor(innerTileWidth/2); j > 0; j--){
            //ctx.fillStyle = "#"+Math.floor(Math.random()*10)+""+Math.floor(Math.random()*10)+""+Math.floor(Math.random()*10); //psychedelic
	    ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(players[i].position.x * tileWidth + tileWidth/2, players[i].position.y * tileWidth + wallWidth * 4, /*innerTileWidth/2*/j, /*innerTileWidth/2*/j, Math.PI * 0, Math.PI * 2); //Switch these around for some fun pawns
            ctx.closePath();
            //ctx.stroke();
            ctx.fill();
         }
      }

      //draw wall section
      var wallCoords = move.getBoardCoords();
      if(wallCoords != null && wallCoords != undefined && wallCoords.length > 0){
         ctx.fillStyle="#00F";
         for(var i=0; i < wallCoords.length; i++){
            var x = wallCoords[i].x * tileWidth;
            var y = wallCoords[i].y * tileWidth;
            var wall = wallCoords[i].wall;
            console.log("num walls: "+wallCoords.length+" x: "+x+" y: "+y+" WALL: "+wall);
            switch(wall){
               case CorridorTile.UP:
                  ctx.fillRect(x,y, tileWidth, wallWidth);
                  break;
               case CorridorTile.DOWN:
                  ctx.fillRect(x, y + tileWidth - wallWidth, tileWidth, wallWidth);
		  break;
	       case CorridorTile.LEFT:
                  ctx.fillRect(x,y, wallWidth, tileWidth);
                  break;
               case CorridorTile.RIGHT:
                  ctx.fillRect(x + tileWidth - wallWidth, y, wallWidth, tileWidth);	
                  break;
            }
         } 
      }

      //draw pawn move if applicable
      var pawnCoords = move.getPawnMoveCoords();
      if(pawnCoords !== null){
         ctx.fillStyle = "#a8f";
         ctx.fillRect(pawnCoords.x * tileWidth, pawnCoords.y * tileWidth, tileWidth, tileWidth);
      }
   }

   CorridorGame.prototype.begin = function(){
      //TODO get move from next player

      //because of the way this is called externally we need to wait by checking player.hasMoved()
         //if true -> get move and advance to next player

        //else do nothing this will get called on an interval
      var gameLoop = setInterval(function(){
         //if(currentPlayer.hasMoved()){
            //check for win 
            //if(currentPlayer.hasWon() ){
		//console.log("win!");
		//clearInterval(gameLoop);
		//return;
	    //}
            //end game tell everyone
            //else
            //advance to next player
            //remove any privileges from revious player   
         //}
         draw();
      }, 10);
   }

    
   //hook up event listeners
   canvas.onmousemove = function(e){
      if(moveType === CorridorGame.WALL_MOVE)
         move.setWallMove(e);
      else//CorridorGame.PAWN_MOVE
         move.setPawnMove(e); //TODO weird maybe move both movements into CorridorPlayer...
   };

   canvas.onmouseleave = function(e){
      move.clearMove(e);
   }

   canvas.onclick = function(e){
      console.log(moveType);
      if(moveType === CorridorGame.WALL_MOVE){
	      var wallCoords = move.getBoardCoords();
              console.log("clicked in wall mode: "+wallCoords);
	      if(wallCoords != null && wallCoords != undefined && wallCoords.length > 0 && players[currentPlayerIndex].wallsLeft > 0){
		 for(var i=0; i < wallCoords.length; i++){
		    var x = wallCoords[i].x;
		    var y = wallCoords[i].y;
		    var wall = wallCoords[i].wall;
		    grid[x][y].setWall(wall);
		 }
//remove wall from players store
	      players[currentPlayerIndex].removeWall();
              advanceTurns();
	      }
	      
	      
      }
      else{//CorridorGame.PAWN_MOVE
         //console.log("clicked in pawn mode: "+move.getPawnMoveCoords());
         //var rect = canvas.getBoundingClientRect();
         //var x = Math.floor( (e.clientX - rect.x) / tileWidth );
         //var y = Math.floor( (e.clientY - rect.y) / tileWidth );
         var newPos = move.getPawnMoveCoords();
         if(newPos !== null){
            players[currentPlayerIndex].position = {x : newPos.x, y : newPos.y};
            if(players[currentPlayerIndex].hasWon()){
               document.getElementById("label").innerHTML="Player "+(currentPlayerIndex+1)+" has won!";
            }
            else{
               advanceTurns();
            }
         }
	 
      }


   }

   function advanceTurns(){
            //console.log(currentPlayerIndex);
            if(currentPlayerIndex < numPlayers - 1)
                currentPlayerIndex++;
            else
                currentPlayerIndex=0;

           document.getElementById("label").innerHTML="Player "+(currentPlayerIndex+1)+"'s Turn";
           document.getElementById("wall-button").innerHTML="Wall : "+players[currentPlayerIndex].wallsLeft;
   }



   CorridorMove.FIRST_POS = innerTileWidth + wallWidth;
   CorridorMove.GAP = innerTileWidth;
  //CorridorMove.LAST_POS
}

CorridorGame.WALL_WIDTH = 1/8; //1/8 of a tile's width

CorridorGame.WHITE = "#FFF";
CorridorGame.BLACK = "#000";
CorridorGame.GRAY = "#AAA";

CorridorGame.WALL_MOVE = 0;
CorridorGame.PAWN_MOVE = 1;
CorridorGame.WALLS = 20; //20 total divided evenly among players (2p -> 10), (3p -> 6), (4p -> 5)
CorridorGame.SIZE = 9;
CorridorGame.P1_START = { x : 4, y : 0 };
CorridorGame.P2_START = { x : 4, y : 8 };
CorridorGame.P3_START = { x : 0, y : 4 };
CorridorGame.P4_START = { x : 8, y : 4 };
CorridorGame.STARTS = [CorridorGame.P1_START, CorridorGame.P2_START, CorridorGame.P3_START, CorridorGame.P4_START];

