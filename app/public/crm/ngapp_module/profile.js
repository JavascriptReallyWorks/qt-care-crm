'use strict';

export default angular
    .module('ZLCsApp.profile', [])
    .controller('profileCtrl', [
        '$scope',
        '$state',
        '$stateParams',
        '$http',
        '$filter',
        '$mdToast',
        '$mdDialog',

        function($scope, $state, $stateParams, $http, $filter, $mdToast, $mdDialog) {

            $scope.init = function() {
                $scope.user = user;
            };

            $scope.updateUser = function() {

                var data = {
                    id: $scope.user._id,
                    user: {
                        nickname: $scope.user.nickname
                    }
                };
                if ($scope.user.pass) {
                    data.user.pass = $scope.user.pass
                }

                $http
                    .post('/cs/user/updateUser', data)
                    .then(function(result) {
                        if (result && result.data && result.data.status === "ok") {

                            $mdToast
                                .show($mdToast.simple().textContent('保存成功!').position('top right').hideDelay(2000))
                                .then(function(response) {});
                        } else {
                            $mdToast.show($mdToast.simple().textContent('保存失败!').position('top right').hideDelay(2000));
                        }
                    });
            };

        }
    ])