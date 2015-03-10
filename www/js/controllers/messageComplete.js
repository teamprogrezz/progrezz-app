$(document).ready(function () {
  
  var msg_uuid = LocalStorage.getSelectedMessageUUID();
  var status = LocalStorage.getCompletedMessageStatus(msg_uuid);      
  var content = LocalStorage.getCompletedMessageContent(msg_uuid);
  
  if (status == "unread")
    ServerRequest.userChangeMessageStatus(msg_uuid, "read", function() {});
    
  $(".panel-title").html('Mensaje #' + shortenID(msg_uuid));
  $(".panel-body").html(content);

});