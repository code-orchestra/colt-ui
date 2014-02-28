'use strict';

angular.module('colt.directives', [])

.directive('browsePath', function($parse, $timeout) {

  return {
    restrict: 'E',
    scope: {
     path: "="
   },
   template: 
   '<div class="form-group row">'+
   '  <label>Main Document:</label>'+
   '  <div class="form-group input-group">'+
   '    <input type="text" name="multiple[]" class="form-control input-sm" ng-model="path">'+
   '    <span class="input-group-btn"><button type="button" ' +
   '    class="btn btn-default btn-add btn-sm">Browse</button></span>'+
   '  </div>'+
   '</div>',
   link: function(scope, element, attrs) {

   }
 };

})

.directive('fileset', function($parse, $timeout) {

  return {
    restrict: 'E',
    scope: {
     paths: "="
   },
   template: 
   '<div class="form-group row">'+
   '  <label>Live Coding Pattern:</label>'+
   '  <div class="form-group input-group">'+
   '    <input type="text" name="multiple[]" class="form-control input-sm" ng-model="paths">'+
   '    <span class="input-group-btn"><button type="button" class="btn btn-default btn-add btn-sm">+</button></span>'+
   '  </div>'+
   '</div>',
   link: function(scope, element, attrs) {

   }
 };

});
