/**
 * Created by Yang1 on 7/5/17.
 */

'use strict';

// import angular from 'angular';
// import uiRouter from 'angular-ui-router';

export default angular.module('ZLCsApp.medical_record_edit', [

])

    .controller('medicalRecordEditCtrl', ['$rootScope','$scope', '$location','$state', '$filter', '$stateParams', '$http', 'ZLCsService', '$mdToast', '$mdDialog','CsConst',

        function ($rootScope, $scope, $location, $state, $filter, $stateParams, $http, ZLCsService, $mdToast, $mdDialog, CsConst) {
            $scope.initMedicalRecordEditCtrl = function() {
                $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
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