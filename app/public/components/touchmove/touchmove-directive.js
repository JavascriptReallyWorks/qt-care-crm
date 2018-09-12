/**
 * Created by lele on 16/7/21.
 */
'use strict';

angular.module('ZLApp.touchmove-directive', [])
    .directive('stopTouchEvent', function () {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            return element.bind(attr.stopTouchEvent, function(e) {
                return e.stopPropagation();
            });
        }
    }
});