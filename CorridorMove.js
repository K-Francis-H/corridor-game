function CorridorMove(){
   var boardCoords = [];
   
   CorridorMove.prototype.setMove = function(mousePos){
      var x = mousePos.clientX;
      var y = mousePos.clientY;
      console.log(x+" "+y);
   }

   
}
