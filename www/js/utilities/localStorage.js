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
  
  namespace.fragmentAlreadyFound = function(msg_uuid, fragment_index) {
    
    var message_list = $.jStorage.get("message_list");
    
    if (message_list.completed_messages[msg_uuid] != null)
      return true;
      
    if (message_list.fragmented_messages[msg_uuid] == null)
      return false;
      
    var fragments = message_list.fragmented_messages[msg_uuid].fragments;
    for (f in fragments)
      if (fragments[f] == fragment_index)
        return true;
      
    return false;
  }

})(LocalStorage);