function CorridorTile(){

   //walls, false = no wall
   var up = false;
   var down = false;
   var left = false;
   var right = false;

   this.setWall = function(wall){
	switch(wall){
		case CorridorTile.UP:
			up = true;
			break;
		case CorridorTile.DOWN:
			down = true;
			break;
		case CorridorTile.LEFT:
			left = true;
			break;
		case CorridorTile.RIGHT:
			right = true;
			break;
	}
   }

   this.isWall = function(wall){
	switch(wall){
		case CorridorTile.UP:
			return up;
		case CorridorTile.DOWN:
			return down;
		case CorridorTile.LEFT:
			return left;
		case CorridorTile.RIGHT:
			return right;
	}
   }

}

//constants
CorridorTile.UP = 0;
CorridorTile.DOWN = 1;
CorridorTile.LEFT = 2;
CorridorTile.RIGHT = 3;
