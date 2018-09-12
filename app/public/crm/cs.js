import '../bower_components/bootstrap/dist/js/bootstrap.min.js'
import '../bower_components/bootstrap/js/tooltip.js'
import '../bower_components/jquery.nicescroll/dist/jquery.nicescroll.min.js'
import "../bower_components/admin-lte/dist/js/app.min.js"

import "../bower_components/froala-wysiwyg-editor/js/froala_editor.min.js"
// Include Froala Editor Plugins
import "../bower_components/froala-wysiwyg-editor/js/plugins/align.min.js"
import "../bower_components/froala-wysiwyg-editor/js/plugins/char_counter.min.js"
import "../bower_components/froala-wysiwyg-editor/js/plugins/code_beautifier.min.js"
import "../bower_components/froala-wysiwyg-editor/js/plugins/code_view.min.js"
import "../bower_components/froala-wysiwyg-editor/js/plugins/colors.min.js"
import "../bower_components/froala-wysiwyg-editor/js/plugins/emoticons.min.js"
import "../bower_components/froala-wysiwyg-editor/js/plugins/entities.min.js"
import "../bower_components/froala-wysiwyg-editor/js/plugins/file.min.js"
import "../bower_components/froala-wysiwyg-editor/js/plugins/font_family.min.js"
import "../bower_components/froala-wysiwyg-editor/js/plugins/font_size.min.js"
import "../bower_components/froala-wysiwyg-editor/js/plugins/fullscreen.min.js"
import "../bower_components/froala-wysiwyg-editor/js/plugins/image.min.js"
import "../bower_components/froala-wysiwyg-editor/js/plugins/image_manager.min.js"
import "../bower_components/froala-wysiwyg-editor/js/plugins/inline_style.min.js"
import "../bower_components/froala-wysiwyg-editor/js/plugins/line_breaker.min.js"
import "../bower_components/froala-wysiwyg-editor/js/plugins/link.min.js"
import "../bower_components/froala-wysiwyg-editor/js/plugins/lists.min.js"
import "../bower_components/froala-wysiwyg-editor/js/plugins/paragraph_format.min.js"
import "../bower_components/froala-wysiwyg-editor/js/plugins/paragraph_style.min.js"
import "../bower_components/froala-wysiwyg-editor/js/plugins/quote.min.js"
import "../bower_components/froala-wysiwyg-editor/js/plugins/save.min.js"
import "../bower_components/froala-wysiwyg-editor/js/plugins/table.min.js"
import "../bower_components/froala-wysiwyg-editor/js/plugins/video.min.js"
import "../bower_components/froala-wysiwyg-editor/js/languages/zh_cn.js"

import 'bootstrap-datepicker/dist/js/bootstrap-datepicker'

import angular from 'angular'
import 'angular-animate'
import 'angular-messages'
import 'angular-aria'
import ngMaterial from 'angular-material'
import 'angular-sanitize'
import 'angular-cookies'
import xeditable from '../components/angular-xeditable/dist/js/xeditable'
import froala from '../components/angular-froala/src/angular-froala'
import angularBootstrap from '../components/angular-bootstrap/ui-bootstrap-tpls'

import uiRouter from 'angular-ui-router'
import ocLazyLoad from 'oclazyload'
import ngFileUpload from 'ng-file-upload'


import csRouter from './csRouter'
import CaseReportListController from './ngapp_controller/case_report_list_controller'
import ZLCsService from './ngapp_service/zlCsService.js'

import CsConst from './ngapp_constant/cs_constant.js'
import MedicalRecordPattern from './ngapp_constant/medical_record_pattern.js'
import MedicalRecordPatternEn from './ngapp_constant/medical_record_pattern_en.js'
import ReportPattern from './ngapp_constant/report_pattern.js'

import TranslateReportModule from './ngapp_module/translate_report_module'
import MedicalRecordTemplateModule from './ngapp_module/medical_record_template_module'
import ChatQaHelperTemplateModule from './ngapp_module/chat_qa_helper_template_module'


import trustHtmlFilter from '../components/trust_html/trust_html-filter.js'
import dragDropDirective from '../components/drag_drop/drag-drop-directive.js'
import mdTplTableDirective from '../components/md_tpl_table/md_tpl_table_directive.js'
import ngTagsInput from '../components/ng-tags-input/ng-tags-input'


import '../bower_components/angular-bootstrap/ui-bootstrap-csp.css'
import '../bower_components/angular-material/angular-material.min.css'
import '../bower_components/bootstrap/dist/css/bootstrap.min.css'
import '../bower_components/angular-xeditable/dist/css/xeditable.css'
import '../bower_components/angular-ui-select/dist/select.min.css'
import '../inspinia/css/inspinia.css'
import '../bower_components/admin-lte/dist/css/AdminLTE.min.css'
import '../bower_components/admin-lte/dist/css/skins/_all-skins.min.css'
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker.css'
import '../manager.css'


// Include Font Awesome
import 'font-awesome/css/font-awesome.min.css'

// Include Froala Editor styles
import '../bower_components/froala-wysiwyg-editor/css/froala_editor.min.css'
import '../bower_components/froala-wysiwyg-editor/css/froala_style.min.css'

// Include Froala Editor Plugins styles
import '../bower_components/froala-wysiwyg-editor/css/plugins/char_counter.css'
import '../bower_components/froala-wysiwyg-editor/css/plugins/code_view.css'
import '../bower_components/froala-wysiwyg-editor/css/plugins/colors.css'
import '../bower_components/froala-wysiwyg-editor/css/plugins/emoticons.css'
import '../bower_components/froala-wysiwyg-editor/css/plugins/file.css'
import '../bower_components/froala-wysiwyg-editor/css/plugins/fullscreen.css'
import '../bower_components/froala-wysiwyg-editor/css/plugins/image_manager.css'
import '../bower_components/froala-wysiwyg-editor/css/plugins/image.css'
import '../bower_components/froala-wysiwyg-editor/css/plugins/line_breaker.css'
import '../bower_components/froala-wysiwyg-editor/css/plugins/table.css'
import '../bower_components/froala-wysiwyg-editor/css/plugins/video.css'

angular.module('ZLCsApp', [
        uiRouter,
        ocLazyLoad,
        ngMaterial,
        xeditable,
        froala,
        angularBootstrap,
        ngTagsInput,
        trustHtmlFilter,
        dragDropDirective.name,
        mdTplTableDirective.name,
        ngFileUpload,
        TranslateReportModule.name,
        MedicalRecordTemplateModule.name,
        ChatQaHelperTemplateModule.name,
    ])
    .config(function($mdThemingProvider, $locationProvider) {

        $(document).ready(function() {
            $("body").tooltip({ selector: '[data-toggle=tooltip]', html: true });
            $("body, html, .wrapper").css("height", "100%")
        });

        $mdThemingProvider.theme('default')
            .accentPalette('blue', {
                'default': '900'
            });
        // $locationProvider.html5Mode({ enabled: true, requireBase: false, rewriteLinks: false });

    })
    .config(csRouter)
    .constant('CsConst', CsConst)
    .constant('MedicalRecordPattern', MedicalRecordPattern)
    .constant('MedicalRecordPatternEn', MedicalRecordPatternEn)
    .constant('ReportPattern', ReportPattern)
    .run(function(editableOptions, editableThemes) {
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
        toolbarButtonsMD: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|', 'color', 'emoticons', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'insertHR', '-', 'insertLink', 'insertImage', 'insertFile', 'insertVideo', 'insertTable', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html'],
        toolbarButtonsSM: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|', 'color', 'emoticons', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'insertHR', '-', 'insertLink', 'insertImage', 'insertFile', 'insertVideo', 'insertTable', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html'],
        placeholderText: 'Ctrl + Enter(Windows) or  Cmd + Enter(Mac) 发送'
    })
    .service('ZLCsService', ZLCsService)
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
    .controller('CaseReportListController', CaseReportListController)
    .controller('CsCtrl', ['$scope', '$state', '$filter', '$stateParams', '$http', '$mdSidenav', '$timeout', '$mdMedia', 'ZLCsService',
        function($scope, $state, $filter, $stateParams, $http, $mdSidenav, $timeout, $mdMedia, ZLCsService) {
            $scope.initCs = function() {
                $stateParams.name ? $scope.title = $stateParams.name : $scope.title = "首页";
                $scope.user = user;
                $scope.showMenu = function(m) {
                    m.in = m.in ? false : true;
                };
            };

            $scope.goToState = function (url, title) {
                $scope.title = title;
                $state.go('cs' + url);
            };

            $scope.$mdMedia = $mdMedia;

            $scope.toggleLeft = buildDelayedToggler('left');
            $scope.toggleRight = buildToggler('right');
            $scope.isOpenRight = function() {
                return $mdSidenav('right').isOpen();
            };

            $scope.curSys = function(url) {
                return location.href.match(new RegExp(url)) ? true : false;
            };

            function buildDelayedToggler(navID) {
                return debounce(function() {
                    // Component lookup should always be available since we are not using `ng-if`
                    $mdSidenav(navID)
                        .toggle()
                        .then(function() {});
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
                        .then(function() {
                            $log.debug("toggle " + navID + " is done");
                        });
                };
            }

            $scope.setMenuFold = function(folding) {
                $scope.menuFold = folding;
            }
        }
    ]);