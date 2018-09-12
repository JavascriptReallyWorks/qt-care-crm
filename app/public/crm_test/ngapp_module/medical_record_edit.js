/**
 * Created by Yang1 on 7/5/17.
 */

'use strict';

angular.module('ZLCsApp.medical_record_edit', [
    'ui.router',
    'ngMaterial',
    "ngMessages",
    'ui.bootstrap',
    "ngTagsInput",
    "xeditable",
    "ngCookies",
    "bw.paging",
])

    .controller('medicalRecordEditCtrl', ['$rootScope','$scope', '$location','$state', '$filter', '$stateParams', '$http', 'ZLCsService', '$mdToast', '$mdDialog','CsConst',

        function ($rootScope, $scope, $location, $state, $filter, $stateParams, $http, ZLCsService, $mdToast, $mdDialog, CsConst) {
            $scope.initMedicalRecordEditCtrl = function() {
                $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                    console.log('Fired')
                    if($stateParams.id) {
                        $scope.$broadcast('ZLCsApp.medicalRecordTemplateSource', {
                            source: 'medical_record_edit',
                            id: $stateParams.id
                        });
                    }
                    else if($stateParams.newMD){
                        $scope.$broadcast('ZLCsApp.medicalRecordTemplateSource', {
                            source: 'medical_record_new',
                        });
                    }
                });
            };
        }]);