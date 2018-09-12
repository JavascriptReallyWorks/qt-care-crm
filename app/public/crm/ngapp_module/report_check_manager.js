'use strict';

import angularPaging from '../../components/angular-paging/paging'

export default angular.module('ZLCsApp.report_check_manager', [
    angularPaging,
])
    //  报告审核list
    .controller('reportCheckCtrl', ['$rootScope','$scope', '$location','$state', '$filter', '$stateParams', '$http', 'ZLCsService', '$mdToast', '$mdDialog','CsConst',

        function ($rootScope,$scope, $location, $state, $filter, $stateParams, $http, ZLCsService, $mdToast, $mdDialog, CsConst) {
            $scope.initReportCheckCtrl = function() {

                $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                    $scope.$broadcast('ZLCsApp.caseReportListTemplateSource', {
                        source:'report_check',
                    });
                });
            };

        }])

    //  报告审核edit
    .controller('reportCheckEditCtrl', ['$rootScope', '$scope', '$state', '$filter', '$stateParams', '$http', '$mdToast', 'Upload','ZLCsService','CsConst',
        function ($rootScope, $scope, $state, $filter, $stateParams, $http, $mdToast,Upload, ZLCsService, CsConst) {

            $scope.initReportCheckEdit =  function() {
                $scope.refreshLogs();

                $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                    $scope.$broadcast('ZLCsApp.medicalRecordTemplateSource', {
                        source:'report_check_edit',
                        medical_record_id:$stateParams.medical_record_id
                    });

                    $scope.$broadcast('ZLCsApp.caseReportTemplateSource', {
                        source:'report_check_edit',
                    });
                });
            };

            $scope.refreshLogs = function () {
                $http.post('/cs/case/queryLogByCase', {
                    id:$stateParams.case_id
                }).then(function (result) {
                    if (result && result.data) {
                        $scope.case = result.data.content;
                    }
                });
            };

        }]);