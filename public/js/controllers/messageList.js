
$(document).ready(function(){
  
  init();
});

function init(){
  
  getUserMessages();
}

Array.prototype.append = function(list) {
  
  for (i = 0; i < list.length; i++) {
     this.push(list[i]);
  }
}

function getUserMessages() {
  
  // Realizando petición de solicitud de todos los mensajes
  ServerRequest.userMessages(function(response_json) {
    renderUserMessages(response_json.response.data);
    LocalStorage.setUserMessageList(response_json.response.data);
  });
}

function getMessageTemplateContext() {
 
  // Context of "message" template
  return {
    msg: {
      uuid: null,
      short_uuid: null
    },
    status: {
      class: null,
      string: null,
      message: null
    },
    fragments: {
      count: null,
      total: null
    },
    progress: {
      class: null,
      percentage: null
    },
    page_destiny: null
  }
}

function renderUserMessages(messages) {
  
  var messageList = [];
  
  // TODO Cambiar para mostrar listas desplegables de mensajes leidos, no leidos, bloqueados e incompletos (ordenados por fecha)
  /* Añadiendo mensajes completados */
  $.each(messages.completed_messages, function(key, message) {
    
    var context = getMessageTemplateContext();
    
    switch(message.status.status) {
      case "locked":
        context.page_destiny = "unlockMessage";
        context.status.string = "Bloqueado";
        context.status.class = "danger beat-animation";
        context.status.message = "Descifra el mensaje";
      break;
      case "unread":
        context.page_destiny = "messageComplete";
        context.status.string = "No leído";
        context.status.class = "warning beat-animation";
        context.status.message = "Lee el mensaje";
      break;
      case "read":
        context.page_destiny = "messageComplete";
        context.status.string = "Leído";
        context.status.class = "success";
        context.status.message = "Misión completada";
      break;
    }
    
    context.msg.uuid = key;
    context.msg.short_uuid = IDUtils.shortenID(key);
    
    context.fragments.count = message.message.total_fragments;
    context.fragments.total = message.message.total_fragments;
    
    context.progress.class = "success";
    context.progress.percentage = 100;
    
    messageList.append(Handlebars.templates.message(context));
  });

  /* Añadiendo mensajes fragmentados */
  $.each(messages.fragmented_messages, function(key, message) {
    
    var context = getMessageTemplateContext();
    
    context.page_destiny = "incompleteLocation";
    context.status.string = "Incompleto";
    context.status.class = "default";
    context.status.message = "Localiza los fragmentos";
        
    context.msg.uuid = key;
    context.msg.short_uuid = IDUtils.shortenID(key);
    
    context.fragments.count = message.fragments.length;
    context.fragments.total = message.message.total_fragments;
    
    context.progress.class = "warning";
    context.progress.percentage = Math.round(message.fragments.length / message.message.total_fragments * 100);
    
    messageList.append(Handlebars.templates.message(context));
  });

  /* Combinando y mostrando lista de mensajes */
  $(".messages").append($(messageList.join("")));
}

function saveSelectedMessageUUID(selected_block) {

  LocalStorage.setSelectedMessageUUID(
    selected_block.querySelector(".message_uuid").getAttribute("uuid")
  );
}

