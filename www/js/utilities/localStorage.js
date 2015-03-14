var LocalStorage = {};
(function(namespace){
  
  namespace.setSelectedMessageUUID = function(msg_uuid) {
    
    $.jStorage.set("selected_message_uuid", msg_uuid);
  }
  
  namespace.getSelectedMessageUUID = function() {
    
    return $.jStorage.get("selected_message_uuid");
  }
  
  namespace.setUserMessageList = function(list) {
    
    $.jStorage.set("message_list", list);
  }
  
  namespace.getCompletedMessageStatus = function(msg_uuid) {
    
    return $.jStorage.get("message_list").completed_messages[msg_uuid].status.status;
  }
  
  namespace.getCompletedMessageContent = function(msg_uuid) {
    
    return $.jStorage.get("message_list").completed_messages[msg_uuid].message.content;
  }

})(LocalStorage);