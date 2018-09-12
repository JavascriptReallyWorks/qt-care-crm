/**
 * Created by Yang1 on 6/30/17.
 */

'use strict';

angular.module('ZLCsApp.case_report_edit_module', [

])
// 生成报告edit
    .controller('caseReportEditCtrl', ['$rootScope', '$scope', '$state', '$filter', '$stateParams', '$http', '$timeout','$mdToast', 'Upload','ZLCsService','CsConst',
        function ($rootScope, $scope, $state, $filter, $stateParams, $http, $timeout, $mdToast,Upload, ZLCsService, CsConst) {

            $scope.initCaseReportEdit =  function() {
                $scope.refreshLogs();

                $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                    $scope.$broadcast('ZLCsApp.medicalRecordTemplateSource', {
                        source:'case_report_edit',
                        medical_record_id:$stateParams.medical_record_id
                    });

                    $scope.$broadcast('ZLCsApp.caseReportTemplateSource', {
                        source:'case_report_edit',
                    });
                });
            };

            $scope.log = {};
            $scope.mrStatusCtrl = true;
            $scope.confirmMR = function (status) {
                if(!$scope.mrStatusCtrl){
                    return false;
                }
                $scope.mrStatusCtrl = false;

                if(!status && (!$scope.log.content || /\s/.test($scope.log.content))){
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('请写清楚具体的病历缺少的信息!')
                            .position('top right')
                            .hideDelay(2000)
                    );
                    $scope.mrStatusCtrl = true;
                    return false;
                }

                $http.post('/cs/case/changeCaseMRStatus', {
                    case_id:$stateParams.case_id,
                    status:(status ? 200 : 100)
                }).then(function (result) {
                    if (result && result.data) {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('更新成功!')
                                .position('top right')
                                .hideDelay(2000)
                        );
                        $scope.mrStatusCtrl = true;


                        //更新订单日志
                        var log = {};
                        if (status) {
                            log.title = "确认病历完整性"
                        } else {
                            log.title = "病历信息缺失，驳回至客服";
                            log.content = $scope.log.content
                        }
                        $http.post('/cs/case/pushLogWithCase', {
                            case_id:$stateParams.case_id,
                            log:log
                        }).then(function (result) {
                            $scope.refreshLogs();
                        });

                    }else{
                        $scope.mrStatusCtrl = true;
                    }
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

        }])

;
