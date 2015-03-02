window.onload = function() {
  init_link_snake(
    function() { console.log("Victoria"); },
    function() { console.log("Derrota"); },
    "www/games/linksnake/img",
    4, 12, 16, "gameview"
  );
};