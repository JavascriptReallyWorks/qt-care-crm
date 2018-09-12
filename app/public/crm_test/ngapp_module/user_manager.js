'use strict';

angular.module('ZLCsApp.user_manager', [
    'ui.router',
    'ngMaterial',
    "ngMessages",
    'ui.bootstrap',
    "ngTagsInput",
    "xeditable",
    "ngCookies",
    "bw.paging",
])

.controller('userManagerCtrl', ['$scope', '$state', '$stateParams', '$http', '$filter', '$mdToast', '$mdDialog',

    function($scope, $state, $stateParams, $http, $filter, $mdToast, $mdDialog) {


            $scope.init = function() {
                initParams();
                queryAllRoles();

            };

            var initParams = function () {
                $scope.roleNameDispalyMap = {};
                $scope.users = [];
                $scope.cond = {user_type: "crm"};
                $scope.currentPage = 1;
                $scope.pageSize = 10;
                $scope.permissions = [
                    {
                        value:false,
                        display:'普通',
                    },
                    {
                        value:true,
                        display:'管理员',
                    }
                ];
            }

            var queryAllRoles = function () {
                $http.post('/cs/user/queryAllRoles').then(function(result) {

                    if (result && result.data && result.data.content) {
                        $scope.roles = result.data.content;
                        angular.forEach($scope.roles, function (val, idx) {
                            $scope.roleNameDispalyMap[val.name] = val.display;
                        })
                    } else {
                        $scope.roles = [];

                    }
                });
            }

            $scope.DoCtrlPagingAct = function(page, pageSize, total) {
                $scope.currentPage = page;
            };
            $scope.$watchGroup(['currentPage'], function(newVal, oldVal) {

                $scope.queryUsers();
            });


            $scope.queryUsers = function() {
                $http.post('/cs/user/queryUsers', {
                    cond: $scope.cond,
                    page: $scope.currentPage,
                    pageSize: $scope.pageSize
                }).then(function(result) {
                    if (result && result.data && result.data.content) {
                        $scope.users = result.data.content.rows;
                        $scope.total = result.data.content.total;

                    } else {
                        $scope.users = [];
                        $scope.total = 0;
                    }
                });
            }

            $scope.checkData = function(data, id) {
                if (!data || data == '') {
                    return "不为空";
                }
            };

            $scope.saveUser = function(user, id) {
                var url = '/cs/user/createUser';
                var data = {
                    user: user
                };

                if (id) {

                    url = '/cs/user/updateUser';
                    data.id = id;
                }


                $http.post(url, data).then(function(result) {
                    if (result && result.data && result.data.status === "ok") {
                        $scope.queryUsers();
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('保存成功!')
                                .position('top right')
                                .hideDelay(2000)
                        ).then(function(response) {
                        });
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('保存失败!')
                                .position('top right')
                                .hideDelay(2000)
                        );
                    }
                });
            };

            $scope.removeUser = function(idx) {

                var user = $scope.users[idx];
                if (!user._id){     // 新增的还未保存的user
                    $scope.users.splice(idx,1);
                    return false;
                }
                var confirm = $mdDialog.confirm()
                    .title('确认要删除用户吗')

                    .ariaLabel('del')
                    .ok('确定')
                    .cancel('取消');

                $mdDialog.show(confirm).then(function() {
                    $http.post('/cs/user/removeUser', { id: user._id }).then(function(result, status, headers) {
                        if (result && result.data && result.data.status === "ok") {
                            $scope.queryUsers();
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent('删除成功!')
                                    .position('top right')
                                    .hideDelay(2000)
                            ).then(function(response) {
                            });
                        } else {
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent('删除失败!')
                                    .position('top right')
                                    .hideDelay(2000)
                            );
                        }

                    });
                });
            };

            $scope.addUser = function() {
                $scope.user = {};
                $scope.users.splice(0, 0, $scope.user);
            };


            $scope.resetPass = function(id) {
                if (!id) {
                    alert('当前用户为新用户,尚未保存')
                    return false;
                }
                var confirm = $mdDialog.confirm()
                    .title('确认要重置密码吗')
                    .textContent('重置后密码为：qt2017')
                    .ariaLabel('del')
                    .ok('确定')
                    .cancel('取消');

                $mdDialog.show(confirm).then(function() {
                    $http.post('/cs/user/resetUserPass', { id: id }).then(function(result, status, headers) {
                        if (result && result.data && result.data.status === "ok") {
                            $scope.queryUsers();
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent('重置成功!')
                                    .position('top right')
                                    .hideDelay(2000)
                            ).then(function(response) {
                            });
                        } else {
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent('重置失败!')
                                    .position('top right')
                                    .hideDelay(2000)
                            );
                        }
                    });
                }, function() {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('重置失败!')
                            .position('top right')
                            .hideDelay(2000)
                    );
                });

            }


        }
    ])