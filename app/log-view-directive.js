'use strict';

(function() {

var logViewElement;
var isMaxScroll = true;

angular.module('log.view.directive', [])

.directive('logView', function() {

  return {
    restrict: 'E',
    controller: function($scope, $element) {
     logViewElement = $element;

     var selected;

     $scope.toggleOpen = function(e) {
      if (window.getSelection().toString().length)return
      if(selected)selected.removeClass("selected");
      var newSelected = $(e.target).parent('li');
      if(newSelected.is(selected)){
        selected = undefined;
      }else{
        newSelected.addClass("selected");
        selected = newSelected;
      }
    }

    // var $log = $(".logContainer .log");
    // function isMaxScroll() {
    //   return $log.scrollTop() == maxScrollTop()
    // }

    // function maxScrollTop() {
    //   return $log.height() - $log.parent().height()
    // }

  },
  link : function(scope, element, attrs) {
    var sourceLink = element.find('a');
    var source = sourceLink.text();
    // source = (source.length < 13)?source:(source.substr(0, 10)+'...')
    sourceLink.text(source);
  },
  replace: true,
  // template:
  // '<div class="logContainer">'+
  // '  <ul class="log" scroll-if>'+
  // '    <li ng-repeat="message in logMessages | limitTo:200 | filter:{level:logFilter}" '+
  // '      ng-click="toggleOpen($event)" scroll-item '+
  // '      ng-class="{info:(message.level==\'INFO\'),warning:(message.level==\'WARNING\'),error:(message.level==\'ERROR\'||message.level==\'FATAL\'||message.level==\'SYNTAX\'),odd:$odd}">'+
  // '      <p>{{message.message}}</p>'+
  // '      <a nc-click="openTarget(message.source)" title="{{message.source}}">{{message.source}}</a>'+
  // '    </li>'+
  // '  </ul>'+
  // '</div>'
  template:
  function() {
      return (
      '<div class="logContainer" scroll-if>'+
      '  <ul class="log">'+
      '    <li bindonce ng-repeat="message in logMessages | limitTo:200 | filter:{level:logFilter}" '+
      '      ng-click="toggleOpen($event)" scroll-item '+
      '      bo-class="{info:(message.level==\'INFO\'),warning:(message.level==\'WARNING\'),error:(message.level==\'ERROR\'||message.level==\'FATAL\'||message.level==\'SYNTAX\'),odd:$odd}">'+
      '      <p bo-text="message.message"></p>'+
      '      <a ng-click="openTarget(message.source)" bo-title="message.source" bo-text="((message.source.length <= 13)?message.source:(message.source.substr(0, 12)+\'~\'))"></a>'+
      '    </li>'+
      '  </ul>'+
      '</div>');
    }
  } 
})

.directive('scrollItem', function(){
  return{
    restrict: "A",
    link: function(scope, element, attributes) {
      if (scope.$last){
        setTimeout(function() {
          scope.$emit("Finished");
        },1);
      }else{
        console.log("Not Finished");
      }
    },
    controller: function($scope){
      $scope.$on("logMessage", function(message) {
          var maxScrollTop = logViewElement[0].scrollHeight - logViewElement.outerHeight();
          isMaxScroll = logViewElement.scrollTop() >= maxScrollTop;
      });
    },
  }
})

.directive('scrollIf', function() {
  return{
    restrict: "A",
    link: function(scope, element, attributes) {
      scope.$on("Finished",function(){
        var chatHeight = element.outerHeight();
        var maxScrollTop = element[0].scrollHeight - element.outerHeight();
        if(isMaxScroll){
          element.scrollTop(maxScrollTop); 
        }
      });
    }
  }
})

})();