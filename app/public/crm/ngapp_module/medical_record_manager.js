/**
 * Created by Yang1 on 7/2/17.
 */

'use strict';
import angularPaging from '../../components/angular-paging/paging'

export default angular.module('ZLCsApp.medical_record_manager', [
        angularPaging
    ])
    .controller('medicalRecordManagerCtrl', ['$scope', '$location', '$state', '$filter', '$timeout', '$stateParams', '$http', 'ZLCsService', '$mdToast', '$mdDialog', 'CsConst',

        function($scope, $location, $state, $filter, $timeout, $stateParams, $http, ZLCsService, $mdToast, $mdDialog, CsConst) {

            var timeoutPromise;
            var delayInMs = 1000;

            $scope.init = function() {
                initParams();
                queryMedicalRecords();
            };

            $scope.ACTIVATION_STATUS = CsConst.ACTIVATION_STATUS;

            $scope.getDriverStatus = function(n) {
                if (n !== undefined) {
                    //$filter
                    return $scope.ACTIVATION_STATUS[n];
                }
                return '无';
            }

            var queryMedicalRecords = function() {
                $http.post('/cs/mdr/queryMedicalRecords', {
                    cond: $scope.cond
                }).then(function(result) {
                    if (result && result.data && result.data.status === 'ok') {
                        console.log(result.data.content);
                        $scope.list = result.data.content;
                    }
                });
            };

            $scope.deleteOne = function(id) {
                var confirm = $mdDialog.confirm()
                    .title('确定要删除？')
                    .textContent('删除后不可恢复')
                    .ariaLabel('del')
                    .ok('确定')
                    .cancel('取消');

                $mdDialog.show(confirm).then(function() {
                    $http.post('/cs/mdr/deleteOneMedicalRecord', { id: id }).then(function(result, status, headers) {
                        if (result) {
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent('删除成功!')
                                    .position('top right')
                                    .hideDelay(2000)
                            );
                            queryMedicalRecords();
                        } else {
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent('删除失败!')
                                    .position('top right')
                                    .hideDelay(2000)
                            );

                        }

                    });
                }, function() {});


            };

            $scope.DoCtrlPagingAct = function(new_page, pageSize, total) {
                $scope.cond.page = new_page;
            };

            $scope.$watchGroup(['cond.page'], function(newVal, oldVal) {
                $location.search($scope.cond);
            });

            $scope.$watchGroup(['cond.patient_name', 'cond.patient_disease'], function(newVal, oldVal) {
                if (newVal !== oldVal) {
                    $timeout.cancel(timeoutPromise);  //does nothing, if timeout already done
                    timeoutPromise = $timeout(function () {   //Set timeout
                        $location.search($scope.cond);
                    }, delayInMs);
                }
            });

            $scope.downloadReport = function(url, lang) {
                console.log(url)
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('报告生成中，请稍等!')
                        .position('top right')
                );
                $http.get(url).then(function(result) {
                    console.log(result);
                    if (result.status == 200) {
                        $http.post('/cs/print_report', {
                            html: result.data,
                            lang: lang
                        }).then(function(result) {
                            if (result.status == 200 && result.data.success) {
                                $mdToast.show(
                                    $mdToast.simple()
                                        .textContent('下载成功!')
                                        .position('top right')
                                        .hideDelay(2000)
                                );
                                var filename = result.data.filename;
                                console.log(window.location.origin + "/" + filename)
                                window.open(window.location.origin + "/" + filename, "_blank")
                            } else {
                                $mdToast.show(
                                    $mdToast.simple()
                                        .textContent('下载失败，请重新!')
                                        .position('top right')
                                        .hideDelay(2000)
                                );
                            }
                        });
                    }

                });
            };

            $scope.showMedicalRecordCases  = function (md) {
                return md.cases.map(function (c) {
                    return c.sid
                });
            };

            $scope.getOssFileWithKey = function (fileKey) {
                window.open("/cs/getOssFileWithKey?fileKey=" + fileKey,"_self")
            };

            $scope.generateMedicalRecordSummary = function (medicalRecordId,lang) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('生成中...')
                        .position('top right')
                );
                var httpSuccess = false;
                $http.post('/cs/generateMedicalRecordSummary', {
                    medicalRecordId,
                    lang,
                }).then(function success(result) {
                    console.log(result);
                    if (result.data.status === 'ok') {
                        var fileKey = result.data.content.fileKey;
                        var medicalRecord = $filter('filter')($scope.list.rows, {_id:medicalRecordId})[0];
                        if(lang ==='cn'){
                            medicalRecord.summaryCnOssKey = fileKey;
                        }
                        else{
                            medicalRecord.summaryEnOssKey = fileKey;
                        }
                        httpSuccess = true;
                    }
                    if(httpSuccess){
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('报告生成成功')
                                .position('top right')
                                .hideDelay(1000)
                        );
                    }
                    else{
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('报告生成失败，请联系量子技术部')
                                .position('top right')
                                .hideDelay(3000)
                        );
                    }
                }, function failure() {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('报告生成失败，请联系量子技术部')
                            .position('top right')
                            .hideDelay(3000)
                    );
                });

            };


            var initParams = function() {
                $scope.cond = {
                    page: $stateParams.page ? parseInt($stateParams.page) : 1,
                    patient_name: $stateParams.patient_name,
                    patient_disease: $stateParams.patient_disease,
                    pageSize: 10,
                };
            };

        }
    ]);