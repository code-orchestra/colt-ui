'use strict';

angular.module('log.view.directive', [])

.directive('logView', function() {

  return {
    restrict: 'E',
    controller: function($scope, $element) {
     var selected;

     $scope.toggleOpen = function(e) {
      if(selected)selected.removeClass("selected");
      var newSelected = $(e.target).parent('li');
      if(newSelected.is(selected)){
        selected = undefined;
      }else{
        newSelected.addClass("selected");
        selected = newSelected;
      }
    };
  },
  replace: true,
  template:
  '<div class="logContainer">'+
  '  <ul class="log" scroll-if>'+
  '    <li ng-repeat="message in logMessages | limitTo:200 | filter:{level:logFilter}" '+
  '      ng-click="toggleOpen($event)" '+
  '      ng-class="{info:(message.level==\'INFO\'),warning:(message.level==\'WARNING\'),error:(message.level==\'ERROR\'||message.level==\'FATAL\'||message.level==\'SYNTAX\'),odd:$odd}" scroll-item>'+
  '      <p>{{message.message}}</p>'+
  '      <a nc-click="openTarget(message.source)" title="{{message.source}}">{{message.source}}</a>'+
  '    </li>'+
  '  </ul>'+
  '</div>'
};

})

.directive('scrollItem', function(){
  return{
    restrict: "A",
    link: function(scope, element, attributes) {
      if (scope.$last){
        scope.$emit("Finished");
      }
    },
    controller: function($scope){
      $scope.$on("log", function(message) {
          console.log("log: " + message);
          // autoscroll
      })
    },
  }
})

.directive('scrollIf', function() {
  return{
    restrict: "A",
    link: function(scope, element, attributes) {
      scope.$on("Finished",function(){
        var chat_height = element.outerHeight();
        console.log("chat_height: " + chat_height);
        element.scrollTop(chat_height); 
      });
    }
  }
})