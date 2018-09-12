/**
 * Created by xincheng on 6/18/16.
 */
'use strict';

angular.module('ZLApp.survival-directive', [])
.directive('survival', function() {
    return {
        restrict: 'E',
        scope: {
            effect: '=',
            field: '@'
        },
        //templateUrl: 'partials/survival_svg',
        template: '<svg class="chart">'+
            '<rect ng-repeat="i in getGridsNumber() track by $index" x="{{ x[$index] }}" y="{{ y[$index] }}" rx="2" ry="2" width="8" height="8" style="{{ grid_style[$index] }}" class="ng-scope"></rect></svg>',
        templateNamespace: 'svg',
        link: function(scope, element, attrs) {
            scope.$watch("effect",function(newValue,oldValue) {
                var effect_colors = {'os': '#ee632b', 'pfs': '#fec827','mos':'#4c8dee','mpfs': '#9573b6','osback': '#ffede6', 'pfsback': '#fff7e1','mosback':'#F7FCFF','mpfsback': '#f2ecf8'};
                scope.x = new Array(12);
                scope.y = new Array(12);
                scope.grid_style = new Array(24);
                var z = (scope.field == "pfs" || scope.field == "mpfs") ? 12 : 24;
                for (var i = 0; i < z; i++) {
                    scope.x[i] = 4 + 12 * (i % 6);
                    scope.y[i] = 4 + 12 * Math.floor(i / 6);
                    if (i > newValue) {
                        scope.grid_style[i] = 'fill:' + effect_colors[scope.field+"back"];
                    } else {
                        scope.grid_style[i] = 'fill:' + effect_colors[scope.field];
                    }
                }
            });

            scope.getGridsNumber = function() { return scope.x; };
        }
    };
});