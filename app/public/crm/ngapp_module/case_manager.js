/**
 * Created by Yang1 on 6/8/17.
 */

'use strict';

import angularPaging from '../../components/angular-paging/paging'

export default angular.module('ZLCsApp.case_manager', [
    angularPaging,
])
    .controller('caseManagerCtrl', ['$scope', '$location', '$state', '$filter','$timeout', '$stateParams', '$http', 'ZLCsService', '$mdToast', '$mdDialog', 'CsConst',

        function($scope, $location, $state, $filter, $timeout, $stateParams, $http, ZLCsService, $mdToast, $mdDialog, CsConst) {

            var timeoutPromise;
            var delayInMs = 1000;

            $scope.initCaseManager = function() {
                initQueryParams();
                queryCases();
            };

            $scope.CaseStatusMap = CsConst.CASE.STATUS_MAP;


            var queryCases = function() {
                $http.post('/cs/case/queryCases', {
                    cond: $scope.cond
                }).then(function(result) {
                    if (result && result.data) {
                        $scope.list = result.data.content;
                    } else {
                        $scope.list = undefined;
                    }
                });
            };

            $scope.updateCase = function(caseData, _id) {
                $http.post('/cs/case/updateCase', {
                    _id,
                    caseData,
                }).then(function success(result) {

                },function fail(err) {
                    throw new Error('Update Case Error: ' + err);
                });
            };

            $scope.deleteCase = function(_id) {
                var confirm = $mdDialog.confirm()
                    .title('确定要删除？')
                    .textContent('删除后不可恢复')
                    .ariaLabel('del')
                    .ok('确定')
                    .cancel('取消');

                $mdDialog.show(confirm).then(function () {
                    $http.post('/cs/case/deleteCase', {
                        _id,
                    }).then(function success(result) {
                        if (result && result.data && result.data.status === "ok") {
                            queryCases();
                        }
                    },function fail(err) {
                        throw new Error('Delete Case Error: ' + err);
                    });
                });
            };

            $scope.changeCaseStatus = function(_id, sid, status) {
                var confirm = $mdDialog.confirm()
                    .title('确定要将 CASE' + sid + '修改为：' + $scope.statusName(status) + ' 吗？' )
                    .ok('确定')
                    .cancel('取消');

                $mdDialog.show(confirm).then(function() {
                    $http.post('/cs/case/changeCaseStatus', {
                        case_id: _id,
                        status: parseInt(status)
                    }).then(function(res) {
                        if (res && res.data && res.data.status === "ok") {
                            queryCases();
                        }
                    });
                }, function() {});
            };


            //$scope.showProductName = function(productArr) { return productArr.map(function(product) { return product.product_name }).join(',') };

            $scope.DoCtrlPagingAct = function(new_page, pageSize, total) {
                $scope.cond.page = new_page;
            };

            $scope.statusName = function(status) { return CsConst.CASE.STATUS_MAP[status] };

            var initQueryParams = function() {

                $scope.cond = {
                    page: $stateParams.page ? parseInt($stateParams.page) : 1,
                    sid: $stateParams.sid,
                    status: $stateParams.status ? parseInt($stateParams.status) : undefined,
                    patientName: $stateParams.patientName,
                    from: $stateParams.from || "CRM",
                    pageSize: 10,
                };

                $scope.CASE_FROM_OPTIONS = [
                    {
                        value:"CRM",
                        display:"客服",
                    },
                    {
                        value:"WECHAT",
                        display:"微信",
                    },
                ];

                $scope.CASE_STATUS_OPTIONS = angular.copy(CsConst.CASE.STATUS_OPTIONS);
                $scope.CASE_STATUS_OPTIONS.unshift({value:undefined, display:'所有(未取消)'});

            };
            $scope.$watchGroup(['cond.page',  'cond.status',  'cond.from'], function(newVal, oldVal) {
                $location.search($scope.cond);
            });

            $scope.$watchGroup([ 'cond.sid',  'cond.patientName'], function(newVal, oldVal) {
                if (newVal !== oldVal) {
                    $timeout.cancel(timeoutPromise);  //does nothing, if timeout already done
                    timeoutPromise = $timeout(function () {   //Set timeout
                        $location.search($scope.cond);
                    }, delayInMs);
                }
            });
        }
    ]);