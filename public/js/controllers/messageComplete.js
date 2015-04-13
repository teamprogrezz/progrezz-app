$(document).ready(function () {
  
  var msg_uuid = LocalStorage.getSelectedMessageUUID();
  var status = LocalStorage.getCompletedMessageStatus(msg_uuid);      
  var content = LocalStorage.getCompletedMessageContent(msg_uuid);
  
  if (status == "unread")
    ServerRequest.userReadMessage(msg_uuid, function() {});
    
  $(".panel-title").html('Mensaje #' + IDUtils.shortenID(msg_uuid));
  $(".panel-body").html(content);

});