'use strict';

angular.module('ZLCsApp.case_edit', [
    'ui.router',
    'ngMaterial',
    'ui.bootstrap',
])
    .controller('caseEditController', ['$scope', '$element', '$state', '$filter', '$stateParams', '$compile', '$timeout', '$http', '$mdToast','ZLCsService','CsConst',

        function ($scope,  $element, $state, $filter, $stateParams, $compile, $timeout, $http, $mdToast,ZLCsService,CsConst) {
            $scope.initCaseEditController = function () {

                initParams();

                // The md-select directive eats keydown events for some quick select
                // logic. Since we have a search input here, we don't need that logic.
                $element.find('input').on('keydown', function(ev) {
                    ev.stopPropagation();
                });

                $scope.clearCsUserSearchTerm = function() {
                    $scope.dataModel.csUserSearchTerm = '';
                };


                $('#birthday').datepicker();
                /*
                $('#birthday').on('changeDate',function () {
                    $scope.theCase.patientBirthday =  moment($('#birthday').val(),"YYYY-MM-DD").toISOString();
                });
                */
                $scope._id = $stateParams._id;
                if($scope._id) {
                    queryCase();
                    queryCaseTickets();
                }
                else{
                    $scope.new = true;
                    $scope.theCase = {};
                }
                queryProductList();

            };

            var initParams = function () {
                $scope.dataModel = {};
                $scope.genderOptions = ['男','女','保密'];
                $scope.stageOptions = ['0期', '1期', '2期', '3期', '4期', '其他'];
                $scope.CASE_STATUS_OPTIONS = CsConst.CASE.STATUS_OPTIONS;
                ZLCsService.qtCsUsers(function (data) {
                    $scope.QT_CS_USERS = data;
                    console.log(data);
                });
            };

            var queryCase = function () {
                var _id = $stateParams._id;
                if(!_id)
                    return false;
                $http.get('/cs/case/'+$scope._id).then(function success(res) {
                    if(res.data.status === 'ok'){
                        $scope.theCase = res.data.content;

                        // 如果是已创建的case，且已经有medical_record_id,不可以再关联病历
                        $scope.disableMdAssignment = $scope.theCase.medical_record_id;
                    }
                    else{
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('获取订单失败，请联系技术人员')
                                .position('top right')
                                .hideDelay(2000)
                        )
                    }
                }, function failure() {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('获取订单失败，请联系技术人员')
                            .position('top right')
                            .hideDelay(2000)
                    )
                });
            };

            var queryProductList = function () {
                $http.post('/cs/product/queryProductList').then(function success(result) {
                    $scope.products = result.data.content;
                });
            };

            $scope.saveAndUpdateCase = function () {
                console.log($scope.theCase);
                var caseData = {
                    ...$scope.theCase
                };
                if($scope.new){ // create
                    caseData.from = 'CRM';
                    caseData.status = CsConst.CASE.STATUS.TO_PAY;
                }
                delete caseData._id;
                $http.post('/cs/case/updateCase',{
                    _id:$scope.theCase._id,
                    caseData
                }).then(function success(res) {
                    if(res && res.data && res.data.status === 'ok'){
                        history.back();
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('保存成功')
                                .position('top right')
                                .hideDelay(1000)
                        );
                    }
                    else{
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('保存失败，请联系量子技术部')
                                .position('top right')
                                .hideDelay(2000)
                        )
                    }
                }, function failure() {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('保存失败，请联系量子技术部')
                            .position('top right')
                            .hideDelay(2000)
                    )
                });
            };


            $scope.onSelectMD = function ($item, $model, $label, $event, treatmentIndex, groupIndex) {
                $scope.theCase.medical_record_id = $item._id;
                $scope.theCase.patientName = $scope.theCase.patientName || $item.patientName;
                $scope.theCase.patientGender = $scope.theCase.patientGender || $item.patientGender;
                $scope.theCase.patientMobile = $scope.theCase.patientMobile || $item.patientMobile;
                $scope.theCase.patientBirthday = $scope.theCase.patientBirthday || $item.patientBirthday;
                $scope.theCase.cancerType = $scope.theCase.cancerType || $item.presentDiagnosis.cancerType;
                $scope.theCase.stage = $scope.theCase.stage || $item.presentDiagnosis.stage;

            };

            $scope.queryDoctorAbstract = function (name) {
                return $http.post('/cs/doctor/queryDoctorAbstract', {
                    name,
                }).then(function (result) {
                    return result.data.content.map(function(item){
                        return item;
                    });
                });
            };

            $scope.queryMdPatients = function (patientName) {
                return $http.post('/cs/mdr/queryMdPatients', {
                    patientName,
                    pageSize: 20
                }).then(function (result) {
                    return result.data.content.map(function(item){
                        return item;
                    });
                });
            };

            var queryCaseTickets = function () {

                $http.post('/cs/caseTicket/queryCaseTickets',{
                    _id:$scope._id,
                }).then(function success(res) {
                    $scope.caseTickets = res.data.content;
                    console.log($scope.caseTickets);
                });
            };

            $scope.newTicketComment = function (idx, _id) {
                var payload = {
                    _id,
                    comment:$scope.dataModel.ticket.newComment[idx],
                };
                if($scope.dataModel.ticket.newCommentAssignees && $scope.dataModel.ticket.newCommentAssignees[idx]){
                    payload.assignees = $scope.dataModel.ticket.newCommentAssignees[idx];
                }
                // payload.comment = addAssigneesToContent(payload.assignees, $scope.dataModel.ticket.newComment[idx]);

                $http.post('/cs/caseTicket/newTicketComment',payload).then(function success(res) {
                    if(res.data && res.data.status === 'ok'){
                        var updatedTicket = res.data.content;
                        var ticketIdx = $scope.caseTickets.map(function (ticket) {
                            return ticket._id
                        }).indexOf(_id);
                        $scope.caseTickets[ticketIdx] = updatedTicket;
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('评论成功')
                                .position('top right')
                                .hideDelay(1000)
                        );
                    }
                    else{
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('评论失败，请联系量子技术部')
                                .position('top right')
                                .hideDelay(2000)
                        )
                    }
                    $scope.dataModel.ticket.newComment[idx] = '';
                    $scope.dataModel.ticket.newCommentAssignees[idx] = undefined;

                }, function fail(err) {
                    console.log(err);
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('评论失败，请联系量子技术部')
                            .position('top right')
                            .hideDelay(2000)
                    )
                });
            };

            $scope.submitNewTicket = function () {
                var payload = {
                    caseId:$scope._id,
                    caseSid:$scope.theCase.sid,
                    title:$scope.dataModel.ticket.newTicket.title,
                    content:$scope.dataModel.ticket.newTicket.content,
                    assignees:$scope.dataModel.ticket.newTicket.assignees ? $scope.dataModel.ticket.newTicket.assignees:[]
                };

                $http.post('/cs/caseTicket/newTicket',payload).then(function success(res) {
                    if(res.data && res.data.status === 'ok'){
                        $scope.caseTickets.push(res.data.content);
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('提交成功')
                                .position('top right')
                                .hideDelay(1000)
                        );
                    }
                    else{
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('提交失败，请联系量子技术部')
                                .position('top right')
                                .hideDelay(2000)
                        )
                    }
                    $scope.dataModel.ticket.newTicket = {};
                }, function fail(err) {
                    console.log(err);
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('提交失败，请联系量子技术部')
                            .position('top right')
                            .hideDelay(2000)
                    )
                });
            };

        }]);

