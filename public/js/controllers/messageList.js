
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

function transformMessagesList(messageList) {
  
  // Ordenando de manera que los mensajes más recientes se sitúen al principio
  messageList.sort(function(a, b) {
    return (b.epoch_date - a.epoch_date);
  });
  
  // Aplicando plantilla de Handlebars para obtener el contenido HTML de los mensajes
  return $.map(messageList, function(val, i) { return Handlebars.templates.message(val); });
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
    page_destiny: null,
    epoch_date: null // 'write_date' en formato 'Epoch' para el ordenado
  }
}

function renderUserMessages(messages) {
  
  var readMessagesList = [];
  var unreadMessagesList = [];
  var lockedMessagesList = [];
  var fragmentedMessagesList = [];
  
  /* Añadiendo mensajes completados */
  $.each(messages.completed_messages, function(key, message) {
    
    var context = getMessageTemplateContext();
    
    context.msg.uuid = key;
    context.msg.short_uuid = IDUtils.shortenID(key);
    
    context.fragments.count = message.message.total_fragments;
    context.fragments.total = message.message.total_fragments;
    
    context.progress.class = "success";
    context.progress.percentage = 100;
    
    context.epoch_date = message.message.write_date;
    
    switch(message.status.status) {
      case "locked":
        context.page_destiny = "unlockMessage";
        context.status.string = "Bloqueado";
        context.status.class = "danger beat-animation";
        context.status.message = "Descifra el mensaje";
        lockedMessagesList.push(context);
      break;
      case "unread":
        context.page_destiny = "messageComplete";
        context.status.string = "No leído";
        context.status.class = "warning beat-animation";
        context.status.message = "Lee el mensaje";
        unreadMessagesList.push(context);
      break;
      case "read":
        context.page_destiny = "messageComplete";
        context.status.string = "Leído";
        context.status.class = "success";
        context.status.message = "Misión completada";
        readMessagesList.push(context);
      break;
    }
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
    
    context.epoch_date = message.message.write_date;
    
    fragmentedMessagesList.push(context);
  });
  
  /* Estableciendo el número de mensajes de cada tipo */
  $(".read-messages-count").text(readMessagesList.length);
  $(".unread-messages-count").text(unreadMessagesList.length);
  $(".locked-messages-count").text(lockedMessagesList.length);
  $(".fragmented-messages-count").text(fragmentedMessagesList.length);
  
  /* Obteniendo contenido HTML a partir de las plantillas, ya ordenado por fecha */
  readMessagesList = transformMessagesList(readMessagesList);
  unreadMessagesList = transformMessagesList(unreadMessagesList);
  lockedMessagesList = transformMessagesList(lockedMessagesList);
  fragmentedMessagesList = transformMessagesList(fragmentedMessagesList);
  
  /* Combinando y mostrando lista de mensajes */
  $(".read-messages").append($(readMessagesList.join("")));
  $(".unread-messages").append($(unreadMessagesList.join("")));
  $(".locked-messages").append($(lockedMessagesList.join("")));
  $(".fragmented-messages").append($(fragmentedMessagesList.join("")));
}

function saveSelectedMessageUUID(selected_block) {

  LocalStorage.setSelectedMessageUUID(
    selected_block.querySelector(".message_uuid").getAttribute("uuid")
  );
}

