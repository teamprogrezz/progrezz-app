$(document).ready(function(){
  
  ServerRequest.userProfile(function(json_response) {
    console.log(json_response.response.data.profile.info.alias);
    console.log(json_response.response.data.profile.info.created_at);
    console.log(json_response.response.data.profile.info.user_id);
    console.log(json_response.response.data.profile.level.current_exp);
    console.log(json_response.response.data.profile.level.current_level);
    console.log(json_response.response.data.profile.level.next_level_exp);
    
    //$("#experience-bar").attr("aria-valuenow", json_response.response.data.profile.level.current_exp);
    //$("#experience-bar").attr("aria-valuemax", json_response.response.data.profile.level.next_level_exp);
    $("#experience-bar").css("width", Math.round((json_response.response.data.profile.level.current_exp / json_response.response.data.profile.level.next_level_exp) * 100) + "%");
    $(".progress-percentage").html(json_response.response.data.profile.level.current_exp + " / " + json_response.response.data.profile.level.next_level_exp + " (" + Math.round((json_response.response.data.profile.level.current_exp / json_response.response.data.profile.level.next_level_exp) * 100) + "%)");
  });
});