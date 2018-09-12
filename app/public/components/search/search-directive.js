/**
 * Created by lele on 16/7/21.
 */
'use strict';

angular.module('ZLApp.search-directive', [])
    .directive('searchBar', function() {
        return {
            restrict: 'E',
            scope: { isOpen: "=" ,searchText:"="},
            template:'<md-button md-no-ink="false" class="search-btn" ng-click="showSearchBar()">' +
            '<md-icon md-svg-src="img/icons/search.svg"></md-icon>' +
            '</md-button>' +
            '<md-toolbar class="md-toolbar-tools search-bar">' +
            '<div class="search-box">' +
            '<md-button aria-label="search" class="hide-search" ng-click="hideSearch();"></md-button>' +
            '<input type="text" placeholder="请输入需要查询的药名" ng-model="searchText" class="form-control search-input"/>' +
            '</div>' +
            '</md-toolbar>',
            link: function(scope, element, attrs) {
                scope.showSearchBar = function () {
                    $(".search-btn").css({
                        "visibility":"hidden"
                    }) &&
                    $(".search-bar").css({
                        "width":"85%",
                        "transition":"width .3s"
                    });
                };
                scope.hideSearch = function () {
                    $(".search-bar").css({
                        "width":"0px",
                        "transition":"width .3s"
                    });
                    $(".search-btn").css({
                        "visibility":"visible"
                    });
                };
              
                scope.$watch('isOpen', function() {
                    if(scope.isOpen){
                        scope.showSearchBar();
                    }else{
                        scope.hideSearch();
                    }
                });

            }
        };
    });