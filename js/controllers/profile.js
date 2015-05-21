$(document).ready(function(){
  
  ServerRequest.userProfile(function(json_response) {
    
    //$("#experience-bar").attr("aria-valuenow", json_response.response.data.profile.level.current_exp);
    //$("#experience-bar").attr("aria-valuemax", json_response.response.data.profile.level.next_level_exp);
    $(".alias").html(json_response.response.data.profile.info.alias);
    $(".level").html(json_response.response.data.profile.level.current_level);
    $("#experience-bar").css("width", Math.round((json_response.response.data.profile.level.current_exp / json_response.response.data.profile.level.next_level_exp) * 100) + "%");
    $(".progress-percentage").html(json_response.response.data.profile.level.current_exp + " / " + json_response.response.data.profile.level.next_level_exp + " (" + Math.round((json_response.response.data.profile.level.current_exp / json_response.response.data.profile.level.next_level_exp) * 100) + "%)");
  });
  
  ServerRequest.userAllowedActions(function(json_response) {
    
    $(".message-duration").html(json_response.response.data.allowed_actions.write_message.duration);
    $(".message-min-length").html(json_response.response.data.allowed_actions.write_message.min_length);
    $(".message-max-length").html(json_response.response.data.allowed_actions.write_message.max_length);
    $(".vision-fragments").html(json_response.response.data.allowed_actions.search_nearby_fragments.radius * 1000);
    $(".accuracy-fragments").html(json_response.response.data.allowed_actions.collect_fragment.radius * 1000);
  });
});