'use strict';

angular.module('log.visualizer.directives', [])

.directive('logVisualizer', function() {

  return {
    restrict: 'E',
    scope : {
      messages: "="
    },
    link: function (scope, element, attrs) {

    },
    template:
    '<div class="log-visualizer">'+
    '    <canvas id="canvas"></canvas>'+
    '</div>'
  };

})
