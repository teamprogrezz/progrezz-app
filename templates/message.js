(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['message'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.escapeExpression, alias2=this.lambda;

  return "<div class='list-group'>\r\n  <a onClick='saveSelectedMessageUUID(this)' href='"
    + alias1(((helper = (helper = helpers.page_destiny || (depth0 != null ? depth0.page_destiny : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"page_destiny","hash":{},"data":data}) : helper)))
    + ".html'>\r\n    <div class='list-group-item'>\r\n      <div class='status-container col-xs-12 clear-margin clear-padding'>\r\n        <span class='col-xs-2 pull-right label label-"
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.status : depth0)) != null ? stack1['class'] : stack1), depth0))
    + "'>"
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.status : depth0)) != null ? stack1.string : stack1), depth0))
    + "</span>\r\n      </div>\r\n      <div class='row-content' style='width:100%;'>\r\n        <div class='row-picture'>\r\n          <img class='circle' src='../assets/img/confidential.jpg' alt='icon'>\r\n        </div>\r\n        <span uuid='"
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.msg : depth0)) != null ? stack1.uuid : stack1), depth0))
    + "' class='message_uuid' class='list-group-item-heading'>Mensaje #"
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.msg : depth0)) != null ? stack1.short_uuid : stack1), depth0))
    + "</span>\r\n        <p class='list-group-item-text'>"
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.status : depth0)) != null ? stack1.message : stack1), depth0))
    + "</p>\r\n      </div>\r\n      <div class='progress progress-striped active'>\r\n        <div class='progress-bar progress-bar-"
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.progress : depth0)) != null ? stack1['class'] : stack1), depth0))
    + "' style='width: "
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.progress : depth0)) != null ? stack1.percentage : stack1), depth0))
    + "%;'>\r\n          <div class='progress-percentage'><span>"
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.fragments : depth0)) != null ? stack1.count : stack1), depth0))
    + "/"
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.fragments : depth0)) != null ? stack1.total : stack1), depth0))
    + "</span></div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </a>\r\n</div>";
},"useData":true});
})();