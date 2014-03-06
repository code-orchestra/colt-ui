'use strict';

angular.module('colt.directives', [])

.directive('browsePath', function() {

  return {
    restrict: 'E',
    scope: {
     label: "@",
     path: "=",
     disabled: "=",
     checkbox: "=",
     placeholder: "@"
   },
   link: function (scope, element, attrs) {
    var fileInput = $(element).find("input:file");
    var button = $(element).find("button");
    console.log("button: " + button.size())
    console.log("file: " + fileInput.size())
    console.log(fileInput);
    button.click(function() {
      console.log("button click");
      fileInput.click();
    });
    fileInput.change(function (changeEvent) {
      console.log("file changed: " + $(fileInput).val())
      scope.$apply(function () {
        scope.path = $(fileInput).val();
      });
    });
  },
  transclude: true,
  template: 
  '<div class="form-group row">'+
  '  <div ng-transclude></div><label ng-show={{label!=undefined}}>{{label}}</label>'+
  '  <div class="input-group input-group-sm">'+
  '    <input type="file" class="hidden" ng-model="path">'+
  '    <input type="text" placeholder="{{placeholder}}" class="form-control" ng-model="path" ng-disabled="disabled">'+
  '    <span class="input-group-btn"><button type="button" ' +
  '    class="btn btn-default btn-add" ng-disabled="disabled">Browse</button></span>'+
  '  </div>'+
  '</div>'
};

})

.directive('copyValue', function() {

  return {
    restrict: 'E',
    scope: {
     label: "@",
     value: "=",
     disabled: "=",
     placeholder: "@"
   },
   template: 
   '<div class="form-group row">'+
   '  <label ng-show={{label!=undefined}}>{{label}}</label>'+
   '  <div class="input-group input-group-sm">'+
   '    <input type="text" placeholder="{{placeholder}}" class="form-control" ng-model="value" ng-disabled="disabled">'+
   '    <span class="input-group-btn"><button type="button" ' +
   '    class="btn btn-default btn-add" ng-disabled="disabled">Copy</button></span>'+
   '  </div>'+
   '</div>'
 };

})

.directive('fileset', function() {

  return {
    restrict: 'E',
    scope: {
      label: "@",
      paths: "=",
      disabled: "=",
      placeholder: "@"
    },
    template: 
    '<div class="form-group row">'+
    '  <label ng-show={{label!=undefined}}>{{label}}</label>'+
    '  <div class="input-group input-group-sm">'+
    '    <input type="text" placeholder="{{placeholder}}" class="form-control" ng-model="paths">'+
    '    <span class="input-group-btn"><button type="button" class="btn btn-default btn-add">+</button></span>'+
    '  </div>'+
    '</div>'
  };

})

.directive('browsePathCheckbox', function() {

  return {
    restrict: 'E',
    scope: {
      label: "@",
      path: "=",
      checked: "=",
      placeholder: "@"
    },
    compile : function(element, attrs) {
      var id = "input" + Math.floor(Math.random() * 10000);
      $(element).find("input:checkbox").attr("id", id);
      $(element).find("label").attr("for", id);
    },
    template: 
    '<div class="form-group row">'+
    '  <input type="checkbox" ng-model="checked"">&nbsp;<label>{{label}}</label>'+
    '  <div class="input-group input-group-sm">'+
    '    <input type="text" placeholder="{{placeholder}}" class="form-control" ng-model="path" ng-disabled="!checked">'+
    '    <span class="input-group-btn"><button type="button" ' +
    '    class="btn btn-default btn-add" ng-disabled="!checked">Browse</button></span>'+
    '  </div>'+
    '</div>'
  };
})


.directive('browsePathRadio', function() {

  return {
    restrict: 'E',
    scope: {
      label: "@",
      paths: "=",
      currentValue: "=",
      expectedValue: "@",
      placeholder: "@"
    },
    compile : function(element, attrs) {
      var id = "input" + Math.floor(Math.random() * 10000);
      $(element).find("input:radio").attr("id", id);
      $(element).find("label").attr("for", id);
    },
    template: 
    '<div class="form-group row">'+
    '  <input type="radio" ng-model="currentValue" ng-value="expectedValue">&nbsp;<label>{{label}}</label>'+
    '  <div class="input-group input-group-sm">'+
    '    <input type="text" placeholder="{{placeholder}}" class="form-control" ng-model="path" ng-disabled="currentValue!=expectedValue">'+
    '    <span class="input-group-btn"><button type="button" ' +
    '    class="btn btn-default btn-add" ng-disabled="!checked">Browse</button></span>'+
    '  </div>'+
    '</div>'
  };

})

.directive('inputRadio', function() {

  return {
    restrict: 'E',
    scope: {
      label: "@",
      paths: "=",
      currentValue: "=",
      expectedValue: "@",
      placeholder: "@"
    },
    compile : function(element, attrs) {
      var id = "input" + Math.floor(Math.random() * 10000);
      $(element).find("input:radio").attr("id", id);
      $(element).find("label").attr("for", id);
    },
    template: 
    '<div class="form-group row">'+
    '  <input type="radio" ng-model="currentValue" ng-value="expectedValue">&nbsp;<label>{{label}}</label>'+
    '  <input type="text" placeholder="{{placeholder}}" class="form-control input-sm" ng-model="path" ng-disabled="currentValue!=expectedValue">'+
    '</div>'
  };

})

.directive('formPartHeader', function() {

  return {
    restrict: 'E',
    scope: {
      label: "@"
    },
    template: 
    '<div class="row">'+
    '  <hr>'+
    '  <h4>{{label}}</h4>'+
    '  <br>'+
    '</div>'
  };

})

.directive('radio', function() {

  return {
    restrict: 'E',
    scope: {
      label: "@",
      currentValue: "=",
      expectedValue: "@"
    },
    compile : function(element, attrs) {
      var id = "input" + Math.floor(Math.random() * 10000);
      $(element).find("input:radio").attr("id", id);
      $(element).find("label").attr("for", id);
    },
    template: 
    '<div class="form-group row">'+
    '  <input type="radio" ng-model="currentValue" ng-value="expectedValue">&nbsp;<label>{{label}}</label>'+
    '</div>'
  };

})

.directive('checkbox', function() {

  return {
    restrict: 'E',
    scope: {
      label: "@",
      checked: "=",
      enabled: "="
    },
    compile : function(element, attrs) {
      if(attrs.enabled === undefined){
        attrs.enabled = "true";
      }
      var id = "input" + Math.floor(Math.random() * 10000);
      $(element).find("input").attr("id", id);
      $(element).find("label").attr("for", id);
    },
    template: 
    '<div class="form-group row">'+
    '  <input type="checkbox" ng-model="checked" ng-disabled="!enabled">&nbsp;<label>{{label}}</label>'+
    '</div>'
  };

})

.directive('value', function() {

  return {
    restrict: 'E',
    scope: {
      label: "@",
      value: "=",
      placeholder: "@"
    },
    template: 
    '<div class="form-group row">'+
    '  <label>{{label}}</label>'+
    '  <input type="text" placeholder="{{placeholder}}" class="form-control input-sm" ng-model="value">'+
    '</div>'
  };

})
