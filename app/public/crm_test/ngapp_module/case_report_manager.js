/**
 * Created by Yang1 on 6/30/17.
 */

'use strict';

angular.module('ZLCsApp.case_report_manager', [
    'ui.router',
    'ngMaterial',
    "ngMessages",
    'ui.bootstrap',
    "ngTagsInput",
    "xeditable",
    "ngCookies",
    "bw.paging",
])
    // 生成报告list
    .controller('caseReportManagerCtrl', ['$rootScope','$scope', '$location','$state', '$filter', '$stateParams', '$http', 'ZLCsService', '$mdToast', '$mdDialog','CsConst',

        function ($rootScope,$scope, $location, $state, $filter, $stateParams, $http, ZLCsService, $mdToast, $mdDialog, CsConst) {
            $scope.initCaseReportManager = function() {
                $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                    $scope.$broadcast('ZLCsApp.caseReportListTemplateSource', {
                        source:'case_report_manager',
                    });
                });
            };



        }])
    ;
