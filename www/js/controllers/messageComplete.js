$(document).ready(function () {
   var response = {id: '1', content: 'My Cool Message' };
   
   msg_id = (parseInt(response.id)+10000).toString(32).toUpperCase();
   
   $(".panel-title").html('Transmision #' + msg_id);
   $(".panel-body").html(response.content);
});