
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
  // TODO Corregir que por algún motivo absurdo, el texto de las barras, parte del centro, en lugar de estar centrado, gracias -.-
  // Realizando petición de solicitud de todos los mensajes
  ServerRequest.userMessages(function(response_json) {
    renderUserMessages(response_json.response.data);
    LocalStorage.setUserMessageList(response_json.response.data);
  });
}

function fillMessageTemplate(msg_uuid, msg_short_uuid, page_destiny, status_class, status_string, status_message, progress_class, progress_percentage, user_fragments_count, total_fragments) {
  
  //TODO Pasar esto a plantilla: utilizar Handlebars
  return ["<div class='list-group'>",
      "<a onClick='saveSelectedMessageUUID(this)' href=views/"+page_destiny+".html>",
        "<div class='list-group-item'>",
          "<div class='status-container col-xs-12 clear-margin clear-padding'><span class='col-xs-2 pull-right label label-"+status_class+"'>"+status_string+"</span></div>",
          "<div class='row-content' style='width:100%;'>",
            "<div class='row-picture'>",
              "<img class='circle' src='assets/img/confidential.jpg' alt='icon'>",
            "</div>",
            "<span uuid='" + msg_uuid +"' class='message_uuid' class='list-group-item-heading'>Mensaje #",msg_short_uuid,"</span>",
            "<p class='list-group-item-text'>"+status_message+"</p>",
          "</div>",
          "<div class='progress progress-striped active'>",
            "<div class='progress-bar progress-bar-", progress_class, "' style='width: ",progress_percentage,"%;'>",
              "<div class='progress-percentage'><span>",user_fragments_count, " / ", total_fragments,"</span></div>",
            "</div>",
          "</div>",
        "</div>",
      "</a>",
    "</div>"];
}

function renderUserMessages(messages) {
  
  var messageList = [];
  
  // TODO Cambiar para mostrar listas desplegables de mensajes leidos, no leidos, bloqueados e incompletos (ordenados por fecha)
  /* Añadiendo mensajes completados */
  $.each(messages.completed_messages, function(key, message) {
    
    var status_string, status_class, status_message, page_destiny;
    
    switch(message.status.status) {
      case "locked":
        page_destiny = "unlockMessage";
        status_string = "Bloqueado";
        status_class = "danger labelBeat";
        status_message = "Descifra el mensaje";
      break;
      case "unread":
        page_destiny = "messageComplete";
        status_string = "No leído";
        status_class = "warning labelBeat";
        status_message = "Lee el mensaje";
      break;
      case "read":
        page_destiny = "messageComplete";
        status_string = "Leído";
        status_class = "success";
        status_message = "Misión completada";
      break;
    }
    
    messageList.append(fillMessageTemplate(key, shortenID(key), page_destiny, status_class, status_string, status_message, "success", 100, message.message.total_fragments, message.message.total_fragments));
  });

  /* Añadiendo mensajes fragmentados */
  $.each(messages.fragmented_messages, function(key, message) {
    
    var progress_percentage = Math.round(message.fragments.length / message.message.total_fragments * 100);
    
    messageList.append(fillMessageTemplate(key, shortenID(key), "incompleteLocation", "default", "Incompleto", "Localiza los fragmentos", "warning", progress_percentage, message.fragments.length, message.message.total_fragments));
  });

  /* Combinando y mostrando lista de mensajes */
  $(".messages").append($(messageList.join("")));
}

function saveSelectedMessageUUID(selected_block) {

  LocalStorage.setSelectedMessageUUID(
    selected_block.querySelector(".message_uuid").getAttribute("uuid")
  );
}

