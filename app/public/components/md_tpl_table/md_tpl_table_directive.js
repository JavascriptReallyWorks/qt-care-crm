// var m1formHTML = require('!ngtemplate?relativeTo=/public/!html!/public/crm/html/m1form.html');
const m1formHTML = require('../../crm/html/m1form.html');
const m1formEnHTML = require('../../crm/html/m1form_en.html');
const mnformHTML = require('../../crm/html/mnform.html');
const mnformEnHTML = require('../../crm/html/mnform_en.html');
const documentListHTML = require('../../crm/html/document_list.html');
const documentListEnHTML = require('../../crm/html/document_list_en.html');
const dicomListHTML = require('../../crm/html/dicom_list.html');
const dicomListEnHTML = require('../../crm/html/dicom_list_en.html');


export default angular.module('ZLCsApp.md_tpl_table_directive', [])
    .directive('m1form', function() {
        return {
            restrict: 'A',
            scope: {
                mdrIndex:'=',
                pattern:'=',
                getFileNameList:'=',
            },
            templateUrl:m1formHTML,
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
            templateUrl:m1formEnHTML,
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
            templateUrl:mnformHTML,
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
            templateUrl:mnformEnHTML,
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
            templateUrl:documentListHTML,
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
            templateUrl:documentListEnHTML,
        }
    })
    .directive('dicomList', function() {
        return {
            restrict: 'A',
            scope: {
                pattern:'=',

                getDicomLink:'=',
            },
            templateUrl:dicomListHTML,
        }
    })
    .directive('dicomListEn', function() {
        return {
            restrict: 'A',
            scope: {
                pattern:'=',

                getDicomLink:'=',
            },
            templateUrl:dicomListEnHTML,
        }
    })

;

