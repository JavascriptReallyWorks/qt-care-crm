/**
 * Created by Yang1 on 7/12/17.
 */

export default class CaseReportListController {
    constructor($scope, $location, $state, $filter, $stateParams, $http, ZLCsService, $mdToast, $mdDialog, CsConst) {
        'ngInject';

        $scope.initCaseReportListCtrl = function() {
            $scope.$on('ZLCsApp.caseReportListTemplateSource', function(event, arg) {
                if (arg) {
                    arg.source === 'case_report_manager' && ($scope.source = 'case_report_manager');
                    arg.source === 'report_check' && ($scope.source = 'report_check');
                }
            });

            initQueryParams();
            queryCases();
        };

        $scope.ACTIVATION_STATUS = CsConst.ACTIVATION_STATUS;

        $scope.getDriverStatus = function(n) {
            if (n !== undefined) {
                //$filter 
                return $scope.ACTIVATION_STATUS[n];
            }
            return '无';
        }

        var queryCases = function() {
            $http.post('/cs/case/queryCases', {
                cond: $scope.cond
            }).then(function(res) {
                if (res && res.data) {
                    $scope.list = res.data.content;
                } else {
                    $scope.list = undefined;
                }
            });
        };

        $scope.productArr = function(productArr) {
            return productArr.map(function(product) {
                return product.product_name
            })
        };

        $scope.productStatus = function(status) {
            return status === 300 ? '已审核' : status === 200 ? '待审核' : status === 150 ? '被驳回' : '已保存';
        };

        $scope.DoCtrlPagingAct = function(new_page, pageSize, total) {
            $scope.cond.page = new_page;
        };

        $scope.$watchGroup(['cond.page', 'cond.order_id', 'cond.status', 'cond.user_name'], function(newVal, oldVal) {
            if (newVal != oldVal) {
                $location.search($scope.cond);
            }
        });

        $scope.statusName = function(status) {
            return CsConst.CASE.STATUS_MAP[status]
        };

        $scope.reportStatus = function(status) {
            return status === 200 ? '（已翻译）' : status === 100 ? '（已保存）' : '';
        };


        $scope.downloadReport = function(url) {
            $mdToast.show(
                $mdToast.simple()
                .textContent('报告生成中，请稍等!')
                .position('top right')
            );
            $http.get(url).then(function(result) {
                if (result.status == 200) {
                    $http.post('/cs/print_report', {
                        html: result.data
                    }).then(function(result) {
                        if (result.status == 200 && result.data.success) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent('下载成功!')
                                .position('top right')
                                .hideDelay(2000)
                            );
                            var filename = result.data.filename;
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
        var initQueryParams = function() {
            $scope.cond = {
                page: $stateParams.page ? parseInt($stateParams.page) : 1,
                order_id: $stateParams.order_id,
                status: $stateParams.status ? parseInt($stateParams.status) : undefined,
                user_name: $stateParams.user_name,
                pageSize: 10,
            };

            var CASE_STATUS = CsConst.CASE.STATUS;
            $scope.statusList = [{
                    value: undefined,
                    display: '所有'
                },
                {
                    value: CASE_STATUS.TO_CONFIRM,
                    display: '待客服确认'
                },
                {
                    value: CASE_STATUS.TO_PAY,
                    display: '待付款'
                },
                {
                    value: CASE_STATUS.TO_DELIVER,
                    display: '待发货'
                },
                {
                    value: CASE_STATUS.TO_EVALUATE,
                    display: '待评价'
                },
                {
                    value: CASE_STATUS.COMPLETED,
                    display: '已完成'
                },
                {
                    value: CASE_STATUS.CANCELLED,
                    display: '已取消'
                },
                {
                    value: CASE_STATUS.DELETED,
                    display: '已删除'
                },

            ];

        };

    };
}