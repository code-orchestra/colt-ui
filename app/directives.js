'use strict';

angular.module('colt.directives', [])

.directive('browsePath', function($parse, $timeout) {

  return {
    restrict: 'E',
    scope: {
     label: "@",
     path: "=",
     disabled: "=",
     checkbox: "="
   },
   transclude: true,
   template: 
   '<div class="form-group row">'+
   '  <div ng-transclude></div><label ng-show={{label!=undefined}}>{{label}}</label>'+
   '  <div class="input-group input-group-sm">'+
   '    <input type="text" class="form-control" ng-model="path" ng-disabled="disabled">'+
   '    <span class="input-group-btn"><button type="button" ' +
   '    class="btn btn-default btn-add" ng-disabled="disabled">Browse</button></span>'+
   '  </div>'+
   '</div>'
 };

})

.directive('fileset', function($parse, $timeout) {

  return {
    restrict: 'E',
    scope: {
      label: "@",
      paths: "=",
      disabled: "="
    },
    transclude: true,
    template: 
    '<div class="form-group row">'+
    '  <div ng-transclude></div><label ng-show={{label!=undefined}}>{{label}}</label>'+
    '  <div class="input-group input-group-sm">'+
    '    <input type="text" class="form-control" ng-model="paths">'+
    '    <span class="input-group-btn"><button type="button" class="btn btn-default btn-add">+</button></span>'+
    '  </div>'+
    '</div>'
  };

})

.directive('browsePathCheckbox', function($parse, $timeout) {

  return {
    restrict: 'E',
    scope: {
      label: "@",
      path: "=",
      checked: "=",
    },
    controller : function() {
      this.log = function(m) {
        console.log(m)
      }
    },
    template: 
    '<div class="form-group row">'+
    '  <input type="checkbox" ng-model="checked"">&nbsp;<label>{{label}}</label>'+
    '  <div class="input-group input-group-sm">'+
    '    <input type="text" class="form-control" ng-model="path" ng-disabled="!checked">'+
    '    <span class="input-group-btn"><button type="button" ' +
    '    class="btn btn-default btn-add" ng-disabled="!checked">Browse</button></span>'+
    '  </div>'+
    '</div>'
  };
})


.directive('browsePathRadio', function($parse, $timeout) {

  return {
    restrict: 'E',
    scope: {
      label: "@",
      paths: "=",
      selected: "=",
    },
    link: function(scope) {
      scope.selected2 = false;
    },
    template: 
    '<div class="form-group row">'+
    '  <input type="radio" ng-model="checked"">&nbsp;<label>{{label}}</label>'+
    '  <div class="input-group input-group-sm">'+
    '    <input type="text" class="form-control" ng-model="path" ng-disabled="!checked">'+
    '    <span class="input-group-btn"><button type="button" ' +
    '    class="btn btn-default btn-add" ng-disabled="!checked">Browse</button></span>'+
    '  </div>'+
    '</div>'
  };

})
