function CorridorPlayer(startPos, walls, type){
   var color;
   this.startPos = startPos;
   this.position = startPos;
   this.wallsLeft = walls;

   var hasMoved = false;

   //TODO need way of retrieving a move (AI, local, or networked)

   //need way to prompt for move if human

   //need a bunch of handling onmouseover events for canvas... best controlled from

   CorridorPlayer.prototype.hasMoved = function(){
      return hasMoved;
   } 

   CorridorPlayer.prototype.getMove = function(){

   }

   CorridorPlayer.prototype.hasWon = function(){
      if(this.position.y === 0 && this.startPos.y === CorridorGame.SIZE-1)
         return true;
      if(this.position.y === CorridorGame.SIZE-1 && this.startPos.y === 0)
         return true;
      if(this.position.x === 0 && this.startPos.x === CorridorGame.SIZE-1)
         return true;
      if(this.position.x === CorridorGame.SIZE-1 && this.startPos.x === 0)
         return true;

      return false;
   }

   this.removeWall = function(){
      this.wallsLeft--;
      if(this.wallsLeft < 0)
         this.wallsLeft = 0;
   }

   //CorridorPlayer.prototype.wallsLeft = function(){
   //   return this.wallsLeft;
   //}
}

CorridorPlayer.TYPE_AI = 0;
CorridorPlayer.TYPE_LOCAL = 1;
CorridorPlayer.TYPE_NETWORKED = 2;
