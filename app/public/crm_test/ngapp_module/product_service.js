/**
 * Created by lele on 16/7/22.
 */
'use strict';

angular.module('ZLCsApp.product_service', [
    'ui.router',
    'ngMaterial',
    "ngMessages",
    'ui.bootstrap',
    "ngTagsInput",
    "xeditable",
    "ngCookies",
    "bw.paging",
])

.controller('productQueryCtrl', ['$scope', '$state', '$filter', '$stateParams', '$http', '$mdToast', '$mdDialog',

    function ($scope, $state, $filter, $stateParams, $http, $mdToast, $mdDialog) {
        $scope.initProductQuery = function () {
            $scope.cond = {
                page: 1,
                pageSize : 10
            };
            $scope.currentPage = 1;
        };

        $scope.DoCtrlPagingAct = function (page, pageSize, total) {
            $scope.cond.page = page;
        };
        $scope.removeProduct = function (id) {
            var confirm = $mdDialog.confirm()
            .title('确定要删除？')
            .textContent('删除后不可恢复')
            .ariaLabel('del')
            .ok('确定')
            .cancel('取消');



            $mdDialog.show(confirm).then(function () {
                $http.post('/cs/product/deleteProductById', {id: id}).then(function (result, status, headers) {
                    if (result) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent('删除成功!')
                            .position('top right')
                            .hideDelay(2000)
                        );
                        $scope.initProductQuery();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent('删除失败!')
                            .position('top right')
                            .hideDelay(2000)
                        );

                    }

                });
            }, function () {
            });


        };
        $scope.$watchGroup(['cond', 'cond.params.product_name', 'cond.page'], function (newVal, oldVal) {
            var cond = {};
            for (var p in $scope.cond.params) {
                if ($scope.cond.params[p] && $scope.cond.params[p] != "") {
                    cond[p] = $scope.cond.params[p]
                }
            }
            if (cond.length == 0) {
                cond = {};
            }

            $http.post('/cs/product/queryProductByCond', {
                cond: cond,
                page: $scope.cond.page,
                limit: $scope.cond.pageSize
            }).then(function (result) {
                if (result && result.data) {
                    $scope.list = result.data.content;
                } else {
                    $scope.list = undefined;
                }
            });

        });

    }])
;

