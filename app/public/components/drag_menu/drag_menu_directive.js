/**
 * Created by lele on 16/7/21.
 */
'use strict';

angular.module('ZLApp.drag_menu_directive', [])
    .directive('dragMenu',['$document', function($document) {
        return {
            restrict: 'E',
            scope: { ngCancer: "="},
            template:"<a href='/nd/#/start?cancer={{cancer}}'>更多</a>",
            link: function($scope, element, attrs) {
                var cancer = $scope.ngCancer;
                $scope.cancer = cancer;
                if(cancer){
                    $(element).show();
                }


                var startX = 0, startY = 0, x = element.offset().left, y = element.offset().top;
                element.css({
                    position: 'positive',
                    cursor: 'move'
                });

                element.on('mousedown', function(event) {
                    event.preventDefault();
                    startX = event.pageX - x;
                    startY = event.pageY - y;
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                });

                function mousemove(event) {
                    y = event.pageY - startY;
                    x = event.pageX - startX;   
                    element.css({
                        top: y + 'px',
                        left:  x + 'px'
                    });
                }

                function mouseup() {
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                }

                var _element = element[0];

                _element.addEventListener("touchstart", function(e) {
                    var touches = e.touches[0];
                    oW = touches.clientX - _element.offsetLeft;
                    oH = touches.clientY - _element.offsetTop;
                    //阻止页面的滑动默认事件
                    document.addEventListener("touchmove",defaultEvent,false);
                },false)
                var oW,oH;
                _element.addEventListener("touchmove", function(e) {
                    var touches = e.touches[0];
                    var oLeft = touches.clientX - oW;
                    var oTop = touches.clientY - oH;
                    if(oLeft < 0) {
                        oLeft = 0;
                    }else if(oLeft > document.documentElement.clientWidth - _element.offsetWidth) {
                        oLeft = (document.documentElement.clientWidth - _element.offsetWidth);
                    }
                    _element.style.left = oLeft + "px";
                    _element.style.top = oTop + "px";
                },false);

                _element.addEventListener("touchend",function() {
                    document.removeEventListener("touchmove",defaultEvent,false);
                },false);
                function defaultEvent(e) {
                    e.preventDefault();
                }


            }
        };
    }]);