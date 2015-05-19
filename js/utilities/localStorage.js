var LocalStorage = {};
(function(namespace){
  
  namespace.setUserID = function(user_id) {
    
    $.jStorage.set("user_id", user_id);
  }
  
  namespace.getUserID = function(user_id) {
    
    return $.jStorage.get("user_id");
  }
  
  namespace.setSelectedMessageUUID = function(msg_uuid) {
    
    $.jStorage.set("selected_message_uuid", msg_uuid);
  }
  
  namespace.getSelectedMessageUUID = function() {
    
    return $.jStorage.get("selected_message_uuid");
  }
  
  namespace.setUserMessageList = function(list) {
    
    $.jStorage.set("message_list", list);
  }
  
  namespace.getCompletedMessageNumberFragments = function(msg_uuid) {

    return $.jStorage.get("message_list").completed_messages[msg_uuid].message.total_fragments;
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
    for (var f = 0; f < fragments.length; ++f)
      if (fragments[f] == fragment_index)
        return true;
      
    return false;
  }
  
  namespace.setUserAlias = function(alias) {
    
    $.jStorage.set("user_alias", alias);
  }
  
  namespace.getUserAlias = function() {
    
    return $.jStorage.get("user_alias");
  }
  
})(LocalStorage);