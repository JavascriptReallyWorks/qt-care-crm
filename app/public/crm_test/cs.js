/**
 * Created by Yang1 on 6/20/17.
 */

angular.module('ZLCsApp', [
    'ui.router',
    'ngMaterial',
    "xeditable",
    "froala",
    "ui.bootstrap",
    "ngTagsInput",
    'ZLApp.unsafe-filter',
    "ZLCsApp.drag-drop-directive",
    'ZLCsApp.md_tpl_table_directive',
    'ZLCsApp.answer_chat_view',
    'ZLCsApp.answer_chat_manager',
    'ZLCsApp.case_manager',
    'ZLCsApp.case_edit',
    'ZLCsApp.case_report_edit_module',
    'ZLCsApp.case_report_manager',
    'ZLCsApp.chat_qa_helper_template_module',
    'ZLCsApp.medical_record_edit',
    'ZLCsApp.medical_record_manager',
    'ZLCsApp.medical_record_template_module',
    'ZLCsApp.product_service',
    'ZLCsApp.product_service_edit',
    'ZLCsApp.profile',
    'ZLCsApp.report_check_manager',
    'ZLCsApp.report_translate_manager',
    'ZLCsApp.cs_convert_count',
    'ZLCsApp.user_manager',
])
    .config(function ($mdThemingProvider, $locationProvider) {

        $(document).ready(function() {
            $("body").tooltip({ selector: '[data-toggle=tooltip]' ,htmlq:true});
            $("body, html, .wrapper").css("height","100%")
        });

        $mdThemingProvider.theme('default')
            .accentPalette('blue', {
                'default': '900'
            });
        // $locationProvider.html5Mode({ enabled: true, requireBase: false, rewriteLinks: false });

    })
    .run(function (editableOptions, editableThemes) {
        editableOptions.theme = 'bs3';
    })
    .value('froalaConfig', {
        key: 'psfqddjnE-13D1qG-10y==',
        language: "zh_cn",
        imageUploadURL: '/upload/upload_image',
        fileUploadURL: '/upload/upload_file',
        imageManagerLoadURL: '/upload/load_images',
        fileUploadMethod: 'POST',
        // fileMaxSize: 20 * 1024 * 1024,
        fileAllowedTypes: ['*'],
        toolbarButtonsMD: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|', 'color', 'emoticons', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'insertHR', '-', 'insertLink', 'insertImage','insertFile', 'insertVideo', 'insertTable', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html'],
        toolbarButtonsSM: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|', 'color', 'emoticons', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'insertHR', '-', 'insertLink', 'insertImage','insertFile', 'insertVideo', 'insertTable', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html'],
        placeholderText: 'Ctrl + Enter(Windows) or  Cmd + Enter(Mac) 发送'
    })
    .config(['$stateProvider', '$urlRouterProvider', "tagsInputConfigProvider", function ($stateProvider, $urlRouterProvider, tagsInputConfigProvider) {
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
            })
            .state('cs.case_manager', {
                url: "/case_manager?page&sid&status&patientName&from",
                views: {
                    "main@cs": {
                        templateUrl: 'cs/cs_partials/case_manager'
                    }
                },
            })
            .state('cs.case_edit', {
                url: "/case_edit?_id",
                views: {
                    "main@cs": {
                        templateUrl: 'cs/cs_partials/case_edit'
                    }
                },
            })
            // 病历管理
            .state('cs.medical_record', {
                url: "/medical_record_manager?page&patient_name&patient_disease",
                views: {
                    "main@cs": {
                        templateUrl: 'cs/cs_partials/medical_record_manager'
                    }
                },
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
            })
            // 新增和修改服务
            .state('cs.product_service_edit', {
                url: "/product_service_edit?id",
                views: {
                    "main@cs": {
                        templateUrl: 'cs/cs_partials/product_service_edit'
                    }
                },
            })
            .state('cs.user_manager', {
                url: "/user_manager",
                views: {
                    "main@cs": {
                        templateUrl: 'cs/cs_partials/user_manager'
                    }
                },
            })

            .state('cs.profile', {
                url: "/profile",
                views: {
                    "main@cs": {
                        templateUrl: 'cs/cs_partials/profile'
                    }
                },
            })


    }])
    .service('messageService', ['$rootScope', function($rootScope) {

        return {
            publish: function(name, parameters) {
                $rootScope.$emit(name, parameters);
            },
            subscribe: function(name, listener) {
                $rootScope.$on(name, listener);
            }
        };
    }])
    .controller('CsCtrl', ['$scope', '$state', '$filter', '$stateParams', '$http', '$mdSidenav','$timeout','$mdMedia','ZLCsService',
        function ($scope, $state, $filter, $stateParams, $http,$mdSidenav,$timeout,$mdMedia, ZLCsService) {
            $scope.initCs = function () {
                $stateParams.name ? $scope.title = $stateParams.name : $scope.title = "首页";
                $scope.user = user;
                $scope.showMenu = function (m) {
                    m.in = m.in ? false : true;
                };
                /* $scope.user.menu = [
                     {"name": "订单管理", "url": ".case_manager"},
                     {"name": "生成报告", "url": ".case_report"},
                     {"name": "报告审核", "url": ".report_check"},
                     {"name": "病历管理", "url": ".medical_record"},
                     {"name": "产品服务", "url": ".product_service"},
                     {"name": "在线回答", "url": ".answer_chat"},
                 ];*/
            };

            $scope.goToState = function (url, title) {
                $scope.title = title;
                $state.go('cs' + url);
            };

            $scope.$mdMedia = $mdMedia;

            $scope.toggleLeft = buildDelayedToggler('left');
            $scope.toggleRight = buildToggler('right');
            $scope.isOpenRight = function(){
                return $mdSidenav('right').isOpen();
            };
            $scope.curSys = function (url) {
                return location.href.match(new RegExp(url)) ? true : false;
            };
            function buildDelayedToggler(navID) {
                return debounce(function() {
                    // Component lookup should always be available since we are not using `ng-if`
                    $mdSidenav(navID)
                        .toggle()
                        .then(function () {
                        });
                }, 200);
            }

            function debounce(func, wait, context) {
                var timer;

                return function debounced() {
                    var context = $scope,
                        args = Array.prototype.slice.call(arguments);
                    $timeout.cancel(timer);
                    timer = $timeout(function() {
                        timer = undefined;
                        func.apply(context, args);
                    }, wait || 10);
                };
            }
            function buildToggler(navID) {
                return function() {
                    // Component lookup should always be available since we are not using `ng-if`
                    $mdSidenav(navID)
                        .toggle()
                        .then(function () {
                            $log.debug("toggle " + navID + " is done");
                        });
                };
            }

            $scope.setMenuFold = function (folding) {
                $scope.menuFold = folding;
            }
        }
    ])
angular.module('ZLCsApp.unsafe-filter', [])
    .filter('unsafe', function($sce) { return $sce.trustAsHtml; });