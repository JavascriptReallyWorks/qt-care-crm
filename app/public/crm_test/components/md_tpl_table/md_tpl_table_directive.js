
angular.module('ZLCsApp.md_tpl_table_directive', [])
    .directive('m1form', function() {
        return {
            restrict: 'A',
            scope: {
                mdrIndex:'=',
                pattern:'=',
                getFileNameList:'=',
            },
            templateUrl:'/crm_test/html/m1form.html',
        }
    })
    .directive('m1formEn', function() {
        return {
            restrict: 'A',
            scope: {
                mdrIndex:'=',
                pattern:'=',
                getFileNameList:'=',
            },
            templateUrl:'/crm_test/html/m1form_en.html',
        }
    })
    .directive('mnform', function() {
        return {
            restrict: 'A',
            scope: {
                key:'=',
                mdrIndex:'=',
                pattern:'=',

                addItem:'=',
                deleteItem:'=',
                getFileNameList:'=',
                newLineSource:'=',
            },
            templateUrl:'/crm_test/html/mnform.html',
        }
    })
    .directive('mnformEn', function() {
        return {
            restrict: 'A',
            scope: {
                key:'=',
                mdrIndex:'=',
                pattern:'=',

                addItem:'=',
                deleteItem:'=',
                getFileNameList:'=',
                newLineSource:'=',
            },
            templateUrl:'/crm_test/html/mnform_en.html',
        }
    })
    .directive('documentList', function() {
        return {
            restrict: 'A',
            scope: {
                mdrIndex:'=',
                pattern:'=',
                tran:'=',

                addItem:'=',
                deleteItem:'=',
                getFileNameList:'=',
                uploadFile:'=',
                downloadFile:'=',
                openModalImage:'=',
                isImage:'=',
            },
            templateUrl:'/crm_test/html/document_list.html',
        }
    })
    .directive('documentListEn', function() {
        return {
            restrict: 'A',
            scope: {
                mdrIndex:'=',
                pattern:'=',
                tran:'=',

                addItem:'=',
                deleteItem:'=',
                getFileNameList:'=',
                uploadFile:'=',
                downloadFile:'=',
                openModalImage:'=',
                isImage:'=',
            },
            templateUrl:'/crm_test/html/document_list_en.html',
        }
    })
    .directive('dicomList', function() {
        return {
            restrict: 'A',
            scope: {
                pattern:'=',

                getDicomLink:'=',
            },
            templateUrl:'/crm_test/html/dicom_list.html',
        }
    })
    .directive('dicomListEn', function() {
        return {
            restrict: 'A',
            scope: {
                pattern:'=',

                getDicomLink:'=',
            },
            templateUrl:'/crm_test/html/dicom_list_en.html',
        }
    })

;

