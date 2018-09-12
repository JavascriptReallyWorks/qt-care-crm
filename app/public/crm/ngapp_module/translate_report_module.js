/**
 * Created by Yang1 on 7/12/17.
 */

export default angular.module('ZLCsApp.report_translate_manager', [

    ])
    .controller('ReportTranslateController', ['$scope', '$location', '$state', '$filter', '$stateParams', '$http', 'ZLCsService', '$mdToast', '$mdDialog', 'CsConst', 'Upload', 'messageService',

        function($scope, $location, $state, $filter, $stateParams, $http, ZLCsService, $mdToast, $mdDialog, CsConst, Upload, messageService) {
            $scope.initReportTranslateController = function() {
                initParams();
                queryReport();
                $scope.product_name = $stateParams.product_name;


                $scope.$on('ZLCsApp.caseReportTemplateSource', function(event, arg) {
                    if (arg) {
                        console.log(arg);
                        arg.source === "case_report_edit" && ($scope.source = "case_report_edit");
                        arg.source === "report_check_edit" && ($scope.source = "report_check_edit");
                        // setStyle();
                    }
                });
            };

            var initParams = function() {
                $scope.trialGroups = [];
                $scope.trialGroupsCN = [];
            };

            var setStyle = function() {
                if ($scope.source === "report_check_edit") $scope.editControl = 'no-pointer-events';
            };

            var queryReport = function() {
                console.log($stateParams.product_id)
                console.log($stateParams.case_id)
                    // return false;
                $http.post('/cs/caseReport/findProductReportWithCase', {
                    product_id: $stateParams.product_id,
                    case_id: $stateParams.case_id
                }).then(function success(result) {
                    if (result && result.data) {
                        $scope.report = result.data.content;
                        $scope.trialGroups = $scope.report.trialGroups;
                        if ($scope.report.trialGroupsCN) {
                            $scope.trialGroupsCN = $scope.report.trialGroupsCN;
                        } else {
                            $scope.trialGroupsCN = angular.copy($scope.trialGroups);
                            clearObjContent($scope.trialGroupsCN);
                        };
                    }
                }, function error(result) {
                    throw new Error(response.statusText);
                });
            };


            var clearObjContent = function(data) {
                if (Array.isArray(data)) {
                    for (var j = 0; j < data.length; j++) {
                        clearObjContent(data[j]);
                    }
                } else if (typeof(data) === 'object') {
                    for (var i in data) {
                        if (data.hasOwnProperty(i)) {
                            if (typeof(data[i]) === 'string' && notId(i)) {
                                data[i] = '';
                            } else if (typeof(data[i]) === 'object' && essentialKey(i)) { // include Array
                                clearObjContent(data[i]);
                            }
                        }
                    }
                }
            };

            var essentialKey = function(str) {
                return str !== 'principalInvestigator' && str !== 'address';
            }

            var notId = function(str) {
                return str !== 'id' && str !== 'testOrderId' && str !== 'nctId';
            }

            $scope.getCsConst = function() {
                return CsConst;
            };

            $scope.saveReport = function(status) {
                if (!status) return false;

                $scope.report.trialGroupsCN = $scope.trialGroupsCN;
                var reportCopy = angular.copy($scope.report);

                delete reportCopy._id;
                //增加报告名称
                reportCopy.report_name = $scope.product_name;

                $http.post('/cs/caseReport/saveProductReport', {
                    report: reportCopy,
                    status: status
                }).then(function(result) {
                    if (result && result.data) {
                        //更新订单日志
                        var log = {};
                        if (status === CsConst.CASE_REPORT.STATUS.SAVED) log.title = "保存报告,等待提交";
                        if (status === CsConst.CASE_REPORT.STATUS.SUBMITTED) log.title = "提交报告,等待审核";

                        $http.post('/cs/case/pushLogWithCase', {
                            case_id: $scope.report.case_id,
                            log: log
                        }).then(function(result) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent('保存成功!')
                                .position('top right')
                                .hideDelay(2000)
                            );
                            history.back();
                        });
                    }
                });
            };

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

        }
    ]);