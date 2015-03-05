$(document).ready(function() {
  $(".unlockButtonPlus").click( function() {
    
    $("#fastclick").hide();
    $("<canvas/>", {"id":"gameview"}).attr({
      width: window.innerWidth,
      height: window.innerHeight
    }).appendTo("body");
    init_link_snake(
      function() { 
        console.log("Victoria");
      },
      function() { 
        console.log("Derrota");
      },
      "../games/linksnake/img",
      5, 16, 10, 0, "gameview"
    );
  })
});