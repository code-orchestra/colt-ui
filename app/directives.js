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
     placeholder: "@",
     nwworkingdir:"=",
     popover: "@"
   },
   link: function (scope, element, attrs) {
    var fileInput = $(element).find("input:file");
    var button = $(element).find("button");
    button.click(function() {
      fileInput.click();
    });
    fileInput.change(function (e) {
      var fileVal = $(fileInput).val();
      // if(scope.nwworkingdir != undefined){
      //   if(fileVal.indexOf(scope.nwworkingdir) == 0){
      //     fileVal = fileVal.substr(scope.nwworkingdir.length);
      //   }
      // }
      scope.$apply(function () {
        scope.path = fileVal;
      });
    });
  },
  transclude: true,
  template: 
  function() {
    return (
    '<div class="form-group row">'+
    '  <div ng-transclude></div><label ng-show={{label!=undefined}}>{{label}}</label><help popover="{{popover}}"></help>'+
    '  <div class="input-group input-group-sm">'+
    '    <input type="file" class="hidden" ng-model="path" nwworkingdir="{{nwworkingdir}}">'+
    '    <input type="text" placeholder="{{placeholder}}" class="form-control" ng-model="path" ng-disabled="disabled">'+
    '    <span class="input-group-btn"><button type="button" '+
    '    class="btn btn-default btn-add" ng-disabled="disabled">Browse</button></span>'+
    '  </div>'+
    '</div>');
  }
};

})

.directive('browsePathCheckbox', function() {

  return {
    restrict: 'E',
    scope: {
      label: "@",
      path: "=",
      checked: "=",
      placeholder: "@",
      popover: "@"
    },
    link: function (scope, element, attrs) {
      var fileInput = $(element).find("input:file");
      var button = $(element).find("button");
      button.click(function() {
        fileInput.click();
      });
      fileInput.change(function (e) {
        scope.$apply(function () {
          scope.path = $(fileInput).val();
        });
      });
      var id = "input" + Math.floor(Math.random() * 10000);
      $(element).find("input:checkbox").attr("id", id);
      $(element).find("label").attr("for", id);
    },
    template: 
    function() {
      return (
      '<div class="form-group row">'+
      '  <input type="checkbox" ng-model="checked"">&nbsp;<label>{{label}}</label><help popover="{{popover}}"></help>'+
      '  <div class="input-group input-group-sm">'+
      '    <input type="file" class="hidden" ng-model="path">'+
      '    <input type="text" placeholder="{{placeholder}}" class="form-control" ng-model="path" ng-disabled="!checked">'+
      '    <span class="input-group-btn"><button type="button" ' +
      '    class="btn btn-default btn-add" ng-disabled="!checked">Browse</button></span>'+
      '  </div>'+
      '</div>');
    }
  };
})

.directive('browsePathRadio', function() {

  return {
    restrict: 'E',
    scope: {
      label: "@",
      path: "=",
      currentValue: "=",
      expectedValue: "@",
      placeholder: "@",
      popover: "@"
    },
    link: function (scope, element, attrs) {
      var fileInput = $(element).find("input:file");
      var button = $(element).find("button");
      button.click(function() {
        fileInput.click();
      });
      fileInput.change(function (e) {
        scope.$apply(function () {
          scope.path = $(fileInput).val();
        });
      });

      var id = "input" + Math.floor(Math.random() * 10000);
      $(element).find("input:radio").attr("id", id);
      $(element).find("label").attr("for", id);
    },
    template: 
    function() {
      return (
      '<div class="form-group row">'+
      '  <input type="radio" ng-model="currentValue" ng-value="expectedValue">&nbsp;<label>{{label}}</label><help popover="{{popover}}"></help>'+
      '  <div class="input-group input-group-sm">'+
      '    <input type="file" class="hidden" ng-model="path">'+
      '    <input type="text" placeholder="{{placeholder}}" class="form-control" ng-model="path" ng-disabled="currentValue!=expectedValue">'+
      '    <span class="input-group-btn"><button type="button" ' +
      '    class="btn btn-default btn-add" ng-disabled="currentValue!=expectedValue">Browse</button></span>'+
      '  </div>'+
      '</div>');
    }
  };

})

.directive('fileset', function() {

  return {
    restrict: 'E',
    scope: {
      label: "@",
      paths: "=",
      disabled: "=",
      placeholder: "@",
      popover: "@"
    },
    template: 
    function() {
      return (
      '<div class="form-group row">'+
      '  <label ng-show={{label!=undefined}}>{{label}}</label><help popover="{{popover}}"></help>'+
      '  <div class="input-group input-group-sm">'+
      '    <input type="text" placeholder="{{placeholder}}" class="form-control" ng-model="paths">'+
      '    <span class="input-group-btn"><button type="button" class="btn btn-default btn-add">+</button></span>'+
      '  </div>'+
      '</div>');
    }
  };

})


.directive('copyValue', function() {

  return {
    restrict: 'E',
    scope: {
     label: "@",
     value: "=",
     disabled: "=",
     placeholder: "@",
     popover: "@"
   },
   link: function(scope, element){
     var input = $(element).find("input:text");
     scope.copy = function() {
        if(top['require']){
          var gui = require('nw.gui');
          var clipboard = gui.Clipboard.get();
          clipboard.set($(input).val());
        }
     }
   },
   template: 
    function() {
      return (
      '<div class="form-group row">'+
      '  <label ng-show={{label!=undefined}}>{{label}}</label><help popover="{{popover}}"></help>'+
      '  <div class="input-group input-group-sm">'+
      '    <input type="text" placeholder="{{placeholder}}" class="form-control" ng-model="value" ng-disabled="disabled">'+
      '    <span class="input-group-btn"><button type="button" ' +
      '    class="btn btn-default btn-add" ng-click="copy()" ng-disabled="disabled">Copy</button></span>'+
      '  </div>'+
      '</div>');
    }
 };

})

.directive('inputRadio', function() {

  return {
    restrict: 'E',
    scope: {
      label: "@",
      path: "=",
      currentValue: "=",
      expectedValue: "@",
      placeholder: "@",
      popover: "@"
    },
    compile : function(element, attrs) {
      var id = "input" + Math.floor(Math.random() * 10000);
      $(element).find("input:radio").attr("id", id);
      $(element).find("label").attr("for", id);
    },
    template: 
    function() {
      return (
      '<div class="form-group row">'+
      '  <input type="radio" ng-model="currentValue" ng-value="expectedValue">&nbsp;<label>{{label}}</label><help popover="{{popover}}"></help>'+
      '  <input type="text" placeholder="{{placeholder}}" class="form-control input-sm" ng-model="path" ng-disabled="currentValue!=expectedValue">'+
      '</div>');
    }
  };
})

.directive('formPartHeader', function() {

  return {
    restrict: 'E',
    scope: {
      label: "@",
      popover: "@"
    },
    template: 
    function() {
      return (
      '<div class="row">'+
      '  <hr>'+
      '  <h4>{{label}}</h4>'+
      '  <br>'+
      '</div>');
    }
  };
})

.directive('radio', function() {

  return {
    restrict: 'E',
    scope: {
      label: "@",
      currentValue: "=",
      expectedValue: "@",
      popover: "@"
    },
    compile : function(element, attrs) {
      var id = "input" + Math.floor(Math.random() * 10000);
      $(element).find("input:radio").attr("id", id);
      $(element).find("label").attr("for", id);
    },
    template: 
    function() {
      return (
      '<div class="form-group row">'+
      '  <input type="radio" ng-model="currentValue" ng-value="expectedValue">&nbsp;<label>{{label}}</label><help popover="{{popover}}"></help>'+
      '</div>');
    }
  };

})

.directive('checkbox', function() {

  return {
    restrict: 'E',
    scope: {
      label: "@",
      checked: "=",
      enabled: "=",
      popover: "@"
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
    function() {
      return (
      '<div class="form-group row">'+
      '  <input type="checkbox" ng-model="checked" ng-disabled="!enabled">&nbsp;<label>{{label}}</label><help popover="{{popover}}"></help>'+
      '</div>');
    }
  };
})

.directive('value', function() {

  return {
    restrict: 'E',
    scope: {
      label: "@",
      value: "=",
      placeholder: "@",
      disabled:"=",
      popover: "@"
    },
    template: 
    function() {
      return (
      '<div class="form-group row">'+
      '  <label>{{label}}</label><help popover="{{popover}}"></help>'+
      '  <input type="text" placeholder="{{placeholder}}" class="form-control input-sm" ng-disabled="disabled" ng-model="value">'+
      '</div>');
    }
  };

})

.directive('number', function() {

  return {
    restrict: 'E',
    scope: {
      label: "@",
      value: "=",
      placeholder: "@",
      disabled:"=",
      min:"@",
      max:"@",
      popover: "@"
    },
    template: 
    function() {
      return (
      '<div class="form-group row">'+
      '  <label>{{label}}</label><help popover="{{popover}}"></help>'+
      '  <input type="number" min="{{min||0}}}" placeholder="{{placeholder}}" class="form-control input-sm" ng-disabled="disabled" ng-model="value">'+
      '</div>');
    }
  };

})

.directive('help', function() {

  return {
    restrict: 'E',
    scope: {
      popover: "@"
    },
    link: function(scope, element) {
      if(scope.popover){
        var a = $(element).find("img");
        var title = $(scope.popover).find("h3").text();
        var content = $(scope.popover).find("div").html();
        a.popover({
          title : '<h4>'+title+'</h4>',
          content: content,
          delay: 300,
          html: true,
          trigger: 'hover',
          placement: 'auto',
          container: '#content'
        });  
      }
    },
    template: 
    function() {
      return (
      '&nbsp;<img src="images/help-icon.png" class="helpLink">');
    }
  };
})




