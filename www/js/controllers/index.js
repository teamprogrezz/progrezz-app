/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/* Phonegap */

var app = {

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        window.navigator.geolocation.getCurrentPosition(function(location) {
            console.log('Location from Phonegap');
            init();
        });

    }
};

app.initialize();


/* Functions */

function getClosestMsg() {
   'use strict';
   $.ajax({
      url: 'http://192.168.93.51:9292/game/dba/geoloc?callback=?',
      type: 'GET',
      //async: false,
      data: $.param({ latitude: 43.293331, longitude: -2.862701, radio: 0.24, n_msg: 3 }),
      contentType: "application/json; charset=utf-8",
      dataType: 'jsonp',
      //jsonp: 'callback',
      //crossDomain: true,
      success: function (response) {
         console.log(response);
      },
      error: function(xml, response, text) {
         console.log(text);
      }
   });
}

function getUserMsg() {
   'use strict';
   renderMessages(getMessagesList());
   $.ajax({
      url: 'http://192.168.93.51:9292/game/dba/msg_user_list?callback=?',
      type: 'GET',
      data: { id_user: 1 },
      contentType: "application/json; charset=utf-8",
      dataType: 'jsonp',
      success: function (response) {
        $(".messages").empty();
         renderMessages(response.messages);
      }, 
      error: function (xml, response, text){
         renderMessages(getMessagesList());
      }
   });
}

function renderMessages(messages){
   $.each(messages, function(key,message){
       var content = "El mensaje esta fragmentado",
       collapsible = "",
       arrayListGroup,
       percentage,
       descifrado=false,
       progressClass="warning",
       msg_id = key,
       status_string,
       status_class,
       page_destiny,
       user_fragments_count=message.total_fragments;
      if ( message.n_fragmentos === message.fragmentos_usuario ){
         descifrado = true;
      }

      if( descifrado === true){
         content = message.contenido;
         progressClass = "success";

      }

      if(message.fragments != null){
        user_fragments_count = message.fragments.length;
      }
      switch (message.status){
         case "locked":
            status_string = "Bloqueado";
            status_class = "danger labelBeat";
            page_destiny = "unlockMessage";
            status_message = "Ya puedes descifrar el Reto";
            break;
         case "unread":
            status_string = "Leido";
            status_class = "success";
            page_destiny = "messageComplete";
            status_message = "Tu Misión ha sido realizada con Éxito";
            break;
         case "read":
            status_string = "No leido";
            status_class = "warning labelBeat";
            page_destiny = "messageComplete"; 
            status_message = "Ya puedes Leer el Mensaje";
            break;
         case "incomplete":
            status_string = "Incompleto";
            status_class = "default";
            page_destiny = "incompleteLocation";
            status_message = "Debes Localizar todos los Fragmentos";
            break
      }

      msg_id = parseInt(key)+10000;


      percentage = Math.round(user_fragments_count / message.total_fragments * 100);

      var arrayListGroup = [
           "<div class='list-group'>",
               "<a href=views/"+page_destiny+".html>",
                 "<div class='list-group-item'>",
                    "<div class='status-container col-xs-12 clear-margin clear-padding'><span class='col-xs-2 pull-right label label-"+status_class+"'>"+status_string+"</span></div>",
                     "<div class='row-picture'>",
                         "<img class='circle' src='assets/img/confidential.jpg' alt='icon'>",
                     "</div>",
                     "<div class='row-content'>",
                       "<span class='list-group-item-heading'>Transmisión #",msg_id.toString(32).toUpperCase(),"</span>",
                       
                       "<p class='list-group-item-text'>Estado: "+status_message+"</p>",
                     "</div>",
                     "<div class='progress progress-striped active'>",
                         "<div class='progress-bar  progress-bar-", progressClass, "' style='width: ",percentage,"%;'>",
                             "<div class='progress-percentage'><span>",user_fragments_count, " / ", message.total_fragments,"</span></div>",
                         "</div>",
                     "</div>",
                 "</div>",
               "</a>",
           "</div>"
       ];

       var listGroup = arrayListGroup.join("");
       $(".messages").append($(listGroup));
   });
}

function getMessagesList(){
    var messages = {"4":{"content":"Mensaje infragmentable","id_user":1,"total_fragments":1,"resource_link":"http://www.example.com","status":"read"},"5":{"content":"Mensaje infragmentable (1)","id_user":1,"total_fragments":1,"resource_link":"http://www.example.com","status":"locked"},"6":{"content":"Mensaje infragmentable (2)","id_user":1,"total_fragments":1,"resource_link":"http://www.example.com","status":"unread"},"1":{"content":"Habia una vez un pinguino chiquitito :)","id_user":1,"total_fragments":3,"resource_link":"http://www.example.com","status":"incomplete","fragments":[1,3]},"2":{"content":"Pepitooooou","id_user":1,"total_fragments":3,"resource_link":"http://www.example.com","status":"incomplete","fragments":[1,2]},"3":{"content":"Este mensaje es falso","id_user":1,"total_fragments":4,"resource_link":"http://www.example.com","status":"incomplete","fragments":[1,4]}};
    return messages;
}

$(document).ready(function(){
    
    init();
});

function init(){
    //$.material.init();
    //$.material.ripples(".list-group-item");
    getUserMsg();
}