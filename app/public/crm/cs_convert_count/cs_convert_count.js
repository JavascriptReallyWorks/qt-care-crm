/**
 * Created by lele on 16/7/22.
 */
'use strict';

angular.module('ZLCsApp.cs_convert_count', [
    'ui.router',
    'ngMaterial',
    "xeditable"
])

.controller('convertCountCtrl', ['$scope', '$state', '$filter', '$stateParams', '$http', '$mdToast', '$mdDialog',

    function ($scope, $state, $filter, $stateParams, $http, $mdToast, $mdDialog) {
        $scope.initConvertCount = function () {

            var newDate = new Date();

            var startDate = newDate.setDate(newDate.getDate() - 7);
            var endDate = new Date();
            $scope.dateList = [];
            $('input[name="dataRange"]').daterangepicker({
                startDate: newDate
            });
            $scope.dateList = getDateRange(startDate, endDate);
            console.log($scope.dateList )
            queryCount(startDate, endDate);

            $('input[name="dataRange"]').on('apply.daterangepicker', function (ev, picker) {
                startDate = picker.startDate.format('YYYY-MM-DD')
                endDate = picker.endDate.format('YYYY-MM-DD');
                $scope.dateList = getDateRange(startDate, endDate);
                queryCount(startDate, endDate)
            });
        };

        function queryCount(startDate, endDate) {
            $http.post('/auth/manager/cs/queryConvertCount', {
                startAt: startDate,
                endAt: endDate
            }).then(function (result) {
                if (result && result.data) {
                    var dataList = result.data;
                    for (var i = 0; i < dataList.length; i++) {
                        var type = dataList[i].type;
                        switch (type) {
                            case "md":
                                $scope.mdCount = dataList[i].data;
                                break;
                            case "conv":
                                $scope.convCount = dataList[i].data;
                                break;
                            case "case":
                                $scope.caseCount = dataList[i].data;
                                break;
                        }
                    }
                } else {
                    $scope.mdCount = undefined;
                    $scope.convCount = undefined;
                    $scope.caseCount = undefined;
                }

            });
        }

        function getDateRange(from, to) {
            var s1 = new Date(from).getTime();
            var s2 = new Date(to).getTime();

            var item = [];
            var days = s2 - s1;
            var time = parseInt(days / (1000 * 60 * 60 * 24));

            for (var i = 0; i < time; i++) {
                var date = new Date(s1 + 1000 * 60 * 60 * 24 * i);
                item.push(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());
            }
            return item;
        }


    }]);

