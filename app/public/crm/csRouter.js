/**
 * Created by Yang1 on 6/29/17.
 */

'use strict';

export default function routing ($stateProvider, $urlRouterProvider, tagsInputConfigProvider) {
    'ngInject';
    $urlRouterProvider.otherwise("/cs");

    tagsInputConfigProvider
        .setDefaults('tagsInput', {
            minLength: 0
        });


    $stateProvider
        .state('cs', {
            url: '/cs?name',
            views: {
                "": {
                    templateUrl: 'cs/cs_partials/index'
                },
                "main@cs": {
                    templateUrl: 'cs/cs_partials/hello'
                }
            }
        })
        //在线回答
        .state('answer_chat', {
            url: "/answer_chat",
            views: {
                "": {
                    templateUrl: 'cs/cs_partials/answer_chat'
                },
                "medical_record@answer_chat": {
                    templateUrl: 'cs/cs_partials/medical_record_template'
                },
                "chat_qa_helper@answer_chat": {
                    templateUrl: 'cs/cs_partials/chat_qa_helper_template'
                }
            },
            resolve: {
                lazyLoad: ($q, $ocLazyLoad) => {
                    "ngInject";
                    let deferred = $q.defer();
                    require.ensure([], function () {
                        let module = require('./ngapp_module/answer_chat_view.js');
                        $ocLazyLoad.load({
                            insertBefore: '#load_controllers_before',
                            name:module.default.name
                        });
                        deferred.resolve(module);
                    });
                    return deferred.promise;
                }
            }
        })
        .state('cs.answer_chat', {
            url: "/answer_chat",
            views: {
                "main@cs": {
                    template: function () {
                        window.open("/cs/#!/answer_chat", '_blank');
                    }
                },
            }
        })
        // 在线问答管理
        .state('cs.answer_chat_manager', {
            url: "/answer_chat_manager",
            views: {
                "main@cs": {
                    templateUrl: 'cs/cs_partials/answer_chat_manager'
                }
            },
            resolve: {
                lazyLoad: ($q, $ocLazyLoad) => {
                    "ngInject";
                    let deferred = $q.defer();
                    require.ensure([], function () {
                        let module = require('./ngapp_module/answer_chat_manager.js');
                        $ocLazyLoad.load({
                            insertBefore: '#load_controllers_before',
                            name:module.default.name
                        });
                        deferred.resolve(module);
                    });
                    return deferred.promise;
                }
            }
        })
        .state('cs.case_manager', {
            url: "/case_manager?page&sid&status&patientName&from",
            views: {
                "main@cs": {
                    templateUrl: 'cs/cs_partials/case_manager'
                }
            },
            resolve: {
                lazyLoad: ($q, $ocLazyLoad) => {
                    "ngInject";
                    let deferred = $q.defer();
                    require.ensure([], function () {
                        let module = require('./ngapp_module/case_manager.js');
                        $ocLazyLoad.load({
                            insertBefore: '#load_controllers_before',
                            // name: 'ZLSysApp.qa_correcting_manager'      // must include angular module name, error 'controller not registered'
                            name:module.default.name
                        });
                        deferred.resolve(module);
                    });
                    return deferred.promise;
                }
            }
        })
        .state('cs.case_edit', {
            url: "/case_edit?_id",
            views: {
                "main@cs": {
                    templateUrl: 'cs/cs_partials/case_edit'
                }
            },
            resolve: {
                lazyLoad: ($q, $ocLazyLoad) => {
                    "ngInject";
                    let deferred = $q.defer();
                    require.ensure([], function () {
                        let module = require('./ngapp_module/case_edit.js');
                        $ocLazyLoad.load({
                            insertBefore: '#load_controllers_before',
                            name:module.default.name
                        });
                        deferred.resolve(module);
                    });
                    return deferred.promise;
                }
            }
        })
        // 病历管理
        .state('cs.medical_record', {
            url: "/medical_record_manager?page&patient_name&patient_disease",
            views: {
                "main@cs": {
                    templateUrl: 'cs/cs_partials/medical_record_manager'
                }
            },
            resolve: {
                lazyLoad: ($q, $ocLazyLoad) => {
                    "ngInject";
                    let deferred = $q.defer();
                    require.ensure([], function () {
                        let module = require('./ngapp_module/medical_record_manager.js');
                        $ocLazyLoad.load({
                            insertBefore: '#load_controllers_before',
                            name:module.default.name
                        });
                        deferred.resolve(module);
                    });
                    return deferred.promise;
                }
            }
        })
        // 病历修改
        .state('cs.medical_record_edit', {
            url: "/medical_record_edit?id&tran&newMD",
            views: {
                "main@cs": {
                    templateUrl: 'cs/cs_partials/medical_record_edit'
                },
                "medical_record@cs.medical_record_edit":{
                    templateUrl: 'cs/cs_partials/medical_record_template'
                }
            },
            resolve: {
                lazyLoad: ($q, $ocLazyLoad) => {
                    "ngInject";
                    let deferred = $q.defer();
                    require.ensure([], function () {
                        let module = require('./ngapp_module/medical_record_edit.js');
                        $ocLazyLoad.load({
                            insertBefore: '#load_controllers_before',
                            name:module.default.name
                        });
                        deferred.resolve(module);
                    });
                    return deferred.promise;
                }
            }
        })
        // 生成报告列表
        .state('cs.case_report', {
            url: "/case_report?page&order_id&status&user_name",
            views: {
                "main@cs": {
                    templateUrl: 'cs/cs_partials/case_report'
                },
                "case_report_list@cs.case_report":{
                    templateUrl: 'cs/cs_partials/case_report_list_template'
                }
            },
            resolve: {
                lazyLoad: ($q, $ocLazyLoad) => {
                    "ngInject";
                    let deferred = $q.defer();
                    require.ensure([], function () {
                        let module = require('./ngapp_module/case_report_manager.js');
                        $ocLazyLoad.load({
                            insertBefore: '#load_controllers_before',
                            name:module.default.name
                        });
                        deferred.resolve(module);
                    });
                    return deferred.promise;
                }
            }
        })
        // 生成报告
        .state('cs.case_report_edit', {
            url: "/case_report_edit?case_id&openid&medical_record_id&product_id&product_name&status",
            views: {
                "main@cs": {
                    templateUrl: 'cs/cs_partials/case_report_edit'
                },
                "medical_record@cs.case_report_edit":{
                    templateUrl: 'cs/cs_partials/medical_record_template'
                },
                "case_report@cs.case_report_edit":{
                    templateUrl: 'cs/cs_partials/case_report_template'
                }
            },
            resolve: {
                lazyLoad: ($q, $ocLazyLoad) => {
                    "ngInject";
                    let deferred = $q.defer();
                    require.ensure([], function () {
                        let module = require('./ngapp_module/case_report_edit_module.js');
                        $ocLazyLoad.load({
                            insertBefore: '#load_controllers_before',
                            name:module.default.name
                        });
                        deferred.resolve(module);
                    });
                    return deferred.promise;
                }
            }
        })
        // 报告审核列表
        .state('cs.report_check', {
            url: "/report_check?page&order_id&status&user_name",
            views: {
                "main@cs": {
                    templateUrl: 'cs/cs_partials/report_check'
                },
                "case_report_list@cs.report_check":{
                    templateUrl: 'cs/cs_partials/case_report_list_template'
                }
            },
            resolve: {
                lazyLoad: ($q, $ocLazyLoad) => {
                    "ngInject";
                    let deferred = $q.defer();
                    require.ensure([], function () {
                        let module = require('./ngapp_module/report_check_manager.js');
                        $ocLazyLoad.load({
                            insertBefore: '#load_controllers_before',
                            name:module.default.name
                        });
                        deferred.resolve(module);
                    });
                    return deferred.promise;
                }
            }
        })
        // 审核报告
        .state('cs.report_check_edit', {
            url: "/report_check_edit?case_id&openid&medical_record_id&product_id&product_name&status",
            views: {
                "main@cs": {
                    templateUrl: 'cs/cs_partials/report_check_edit'
                },
                "medical_record@cs.report_check_edit":{
                    templateUrl: 'cs/cs_partials/medical_record_template'
                },
                "case_report@cs.report_check_edit":{
                    templateUrl: 'cs/cs_partials/case_report_template'
                }
            }
        })
        // 服务内容维护
        .state('cs.product_service', {
            url: "/product_service",
            views: {
                "main@cs": {
                    templateUrl: 'cs/cs_partials/product_service'
                }
            },
            resolve: {
                lazyLoad: ($q, $ocLazyLoad) => {
                    "ngInject";
                    let deferred = $q.defer();
                    require.ensure([], function () {
                        let module = require('./ngapp_module/product_service.js');
                        $ocLazyLoad.load({
                            insertBefore: '#load_controllers_before',
                            name:module.default.name
                        });
                        deferred.resolve(module);
                    });
                    return deferred.promise;
                }
            }
        })
        // 新增和修改服务
        .state('cs.product_service_edit', {
            url: "/product_service_edit?id",
            views: {
                "main@cs": {
                    templateUrl: 'cs/cs_partials/product_service_edit'
                }
            },
            resolve: {
                lazyLoad: ($q, $ocLazyLoad) => {
                    "ngInject";
                    let deferred = $q.defer();
                    require.ensure([], function () {
                        let module = require('./ngapp_module/product_service_edit');
                        $ocLazyLoad.load({
                            insertBefore: '#load_controllers_before',
                            name:module.default.name
                        });
                        deferred.resolve(module);
                    });
                    return deferred.promise;
                }
            }
        })
        .state('cs.user_manager', {
            url: "/user_manager",
            views: {
                "main@cs": {
                    templateUrl: 'cs/cs_partials/user_manager'
                }
            },
            resolve: {
                lazyLoad: ($q, $ocLazyLoad) => {
                    "ngInject";
                    let deferred = $q.defer();
                    require.ensure([], function () {
                        let module = require('./ngapp_module/user_manager.js');
                        $ocLazyLoad.load({
                            insertBefore: '#load_controllers_before',
                            name:module.default.name
                        });
                        deferred.resolve(module);
                    });
                    return deferred.promise;
                }
            }
        })

        .state('cs.profile', {
            url: "/profile",
            views: {
                "main@cs": {
                    templateUrl: 'cs/cs_partials/profile'
                }
            },
            resolve: {
                lazyLoad: ($q, $ocLazyLoad) => {
                    "ngInject";
                    let deferred = $q.defer();
                    require.ensure([], function () {
                        let module = require('./ngapp_module/profile.js');
                        $ocLazyLoad.load({
                            insertBefore: '#load_controllers_before',
                            name:module.default.name
                        });
                        deferred.resolve(module);
                    });
                    return deferred.promise;
                }
            }
        })


};