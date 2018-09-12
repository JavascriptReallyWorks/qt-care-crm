'use strict';


angular.module('ZLCsApp.medical_record_template_module', [
    'ui.router',
    'ngMaterial',
    "ngMessages",
    'ui.bootstrap',
    "ngTagsInput",
    "xeditable",
    "ngCookies",
    "bw.paging",
    'ngFileUpload'
])
    .controller('MedicalRecordTemplateController', ['$scope', '$location','$state', '$filter', '$stateParams', '$http', 'ZLCsService', '$mdToast', '$mdDialog','CsConst', 'MedicalRecordPattern', 'MedicalRecordPatternEn', 'messageService','Upload',

        function ($scope, $location, $state, $filter, $stateParams, $http, ZLCsService, $mdToast, $mdDialog, CsConst, MedicalRecordPattern, MedicalRecordPatternEn, messageService, Upload) {
            'ngInject';

            var idArr = [];

            const documentTypeTranslation = {
                '病历记录': 'Medical Record',
                '血液检查报告': 'Blood Test',
                '尿液及大便常规': 'Urine and Stool Report',
                '细菌培养报告': 'Bacterial Culture Report',
                '病理检查报告': 'Pathology Report',
                '内镜操作检查报告': 'Endoscopic Inspection Report',
                '影像学检查报告': 'Imaging Report',
                '合同': 'Contract',
                '证件': 'ID',
            };

            $scope.initMedicalRecordTemplateCtrl = function() {
                initParams();
                queryProductList();
                $scope.$on('ZLCsApp.medicalRecordTemplateSource', function(event, arg) {

                    if (arg) {
                        $scope.source = arg.source;
                        $scope.openid = arg.openid;
                        (arg.source === 'answer_chat') && fromAnswerChatJoinChat(arg.openid);   // 在线聊天页面 点击对话后获得用户所有病例
                        (arg.source === 'answer_chat_from_case_medical_record') && getMedicalRecordOfId(arg.medical_record_id); // 在线聊天页面 从case获得单个病历
                        (arg.source === 'medical_record_edit') && getMedicalRecordOfId(arg.id);     // 病历管理页面 修改/翻译
                        (arg.source === 'medical_record_new') && $scope.createNewMedicalRecord();      // 病历管理页面 新建
                        (arg.source === 'case_report_edit') && getMedicalRecordOfId(arg.medical_record_id);
                        (arg.source === 'report_check_edit') && getMedicalRecordOfId(arg.medical_record_id);
                        // setStyle();
                    }
                });
            };

            var queryProductList = function () {
                $http.post('/cs/product/queryProductList').then(function success(result) {
                    $scope.products = result.data.content;
                });
            };

            $scope.createCaseFromMD = function (idx, productId) {
                var md = $scope.medicalRecords[idx];
                if(!md._id){
                    alert("请先保存新病历");
                    return false;
                }
                $http.post('/cs/case/createCaseFromMD', {
                    mdId: md._id,
                    productId: productId,
                }).then(function success(res) {
                    if(res.data.status === 'ok'){
                        $scope.$emit('newCaseFromMD', {});      // 通知answer_chat_view更新病历列表
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('订单创建成功')
                                .position('top right')
                                .hideDelay(2000)
                        )
                    }
                    else{
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('订单创建失败，请联系技术人员')
                                .position('top right')
                                .hideDelay(2000)
                        )
                    }
                }, function failure() {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('订单创建失败，请联系技术人员')
                            .position('top right')
                            .hideDelay(2000)
                    )
                });

            };

            $scope.canSave = function() {
                return ['answer_chat', 'answer_chat_from_case_medical_record', 'medical_record_edit'].indexOf($scope.source) > -1;
            };

            var setStyle = function() {
                if ($scope.source === 'case_report_edit' || $scope.source === 'report_check_edit') $scope.editControl = 'no-pointer-events';
            };

            var fromAnswerChatJoinChat = function(openid){
                $scope.showmdConnectSection = false;
                $scope.dataModel = {};
                getMedicalRecordOfUser(openid);
            };

            var getMedicalRecordOfUser = function(openid) {

                if (!openid || openid == "") {
                    $scope.medicalRecords = null;
                    $scope.updateDisable = false;
                    return false;
                }
                $http.post('/cs/mdr/findMedicalRecord', {
                    openid: openid
                }).then(function success(result) {
                    $scope.updateDisable = false;

                    if (result && result.data) {
                        loadMedicalRecordPattern(result.data.content);
                    } else
                        $scope.medicalRecords = null;

                }, function failure() {
                    $scope.updateDisable = false;
                });
            };

            var getMedicalRecordOfId = function(id, tran) {
                if (!id) {
                    $scope.medicalRecords = null;
                    return false;
                }
                $http.post('/cs/mdr/findMedicalRecordOfId', {
                    id: id
                }).then(function(result) {
                    if (result && result.data) {
                        loadMedicalRecordPattern(result.data.content);

                        if ($scope.source === 'medical_record_edit') {
                            setTimeout(function() {
                                $scope.$apply(function() {
                                    $("[data-widget='collapse']").click();
                                });
                            }, 0);
                        }
                    } else $scope.medicalRecords = null;

                    if ($stateParams.tran) {
                        $scope.initTran(result.data.content);
                    }
                });
            };


            $scope.openTab = function(evt) {
                if (!$scope.tran)
                    return false;
                var tabIndex = $(evt.target).closest('li').index();
                $(".nav-tabs li").removeClass('active');
                $(".tab-pane").removeClass('active');
                $(".nav-tabs").each(function() {
                    $(this).find("li:eq(" + tabIndex + ")").addClass('active');
                });
                $(".tab-content").each(function() {
                    $(this).find(".tab-pane:eq(" + tabIndex + ")").addClass('active');
                });

            };


            $scope.initTran = function(data) {
                $scope.tran = true;
                $scope.updateDisable = false;
                if (data) {
                    loadMedicalRecordPatternEn(data);
                }

            };
            var loadMedicalRecordPatternEn = function(arrData) {
                for (var i = 0; i < arrData.length; i++) {
                    var data = angular.copy(arrData[i]);
                    var dataEn = arrData[i].en;
                    var tmp = angular.copy(MedicalRecordPatternEn);
                    for (var key in tmp) {
                        if (!tmp.hasOwnProperty(key)) continue;
                        if (dataEn && dataEn.hasOwnProperty(key)) {
                            tmp[key].value = dataEn[key];
                        } else if (data.hasOwnProperty(key)) {
                            if(key === 'patientName' || key === 'patientAddress'){
                                tmp[key].value = '';
                                continue;
                            } else if(key === 'patientTags'){
                                tmp[key].value = [];
                                continue;
                            }

                            var value = data[key];
                            var type = tmp[key].type;

                            switch (type) {
                                case 'mnform':
                                    for (var j = 0; j < value.length; j++) {
                                        var item = value[j]
                                        for (var kk in item) {
                                            if (item[kk] && tmp[key].filter[kk] === 'dropdown' && tmp[key].subOptions && tmp[key].subOptionsEn) {
                                                item[kk] = matchIndexValue(kk, item[kk], tmp[key].subOptions, tmp[key].subOptionsEn)
                                            } else if (item[kk] && tmp[key].filter[kk] === 'dropdownFile') {
                                                item[kk] = changeDocumentType(item[kk]);
                                            } else if (item[kk] && isMnformTextInput(tmp[key].filter[kk])) {
                                                if(key !== 'patientWeight' && kk !== 'operator' && kk !== 'accessionNumber')
                                                    item[kk] = '';
                                            }
                                        }
                                    }
                                    break;

                                case 'm1form':
                                    var item = value;
                                    for (var kk in item) {
                                        if (item[kk] && tmp[key].filter[kk] === 'dropdown' && tmp[key].subOptions && tmp[key].subOptionsEn) {
                                            item[kk] = matchIndexValue(kk, item[kk], tmp[key].subOptions, tmp[key].subOptionsEn)
                                        } else if (item[kk] && tmp[key].filter[kk] === 'dropdownMulti' && tmp[key].subOptions && tmp[key].subOptionsEn) {
                                            item[kk] = matchMultiIndexValue(kk, item[kk], tmp[key].subOptions, tmp[key].subOptionsEn)
                                        } else if (item[kk] && tmp[key].filter[kk] === 'dropdownFile') {
                                            item[kk] = changeDocumentType(item[kk]);
                                        } else if (item[kk] && isM1formTextInput(tmp[key].filter[kk])) {
                                            if(key !== 'patientHeight')
                                                item[kk] = '';
                                        }
                                    }
                                    break;

                                case 'documents':
                                    for (var j = 0; j < value.length; j++) {
                                        var item = value[j]
                                        if (item.documentType && tmp[key].documentTypeOptions.indexOf(item.documentType) >= 0) {
                                            item.documentType = tmp[key].documentTypeOptionsEn[tmp[key].documentTypeOptions.indexOf(item.documentType)];
                                        }
                                        item.institution = '';
                                        item.providerName = '';
                                        item.comments = '';
                                    }
                                    break;

                                case 'select':
                                    if (value && tmp[key].options && tmp[key].optionsEn && tmp[key].options.indexOf(value) >= 0) {
                                        value = tmp[key].optionsEn[tmp[key].options.indexOf(value)];
                                    }
                                    break;
                            }
                            tmp[key].value = value;
                        }
                    }
                    tmp._id = data._id;
                    // messageService.publish('medicalRecord', {
                    //     patient_disease:tmp["patient_disease"].value,
                    //     patient_disease_condition:data["patient_disease_condition"]
                    // });
                    $scope.medicalRecords[i].en = tmp;
                }
            };

            var isMnformTextInput = function(str){
                return str === 'input' || str === 'inputarea' || str === 'text' || str === 'textarea' ;
            };

            var isM1formTextInput = function(str){
                return str === 'text' || str === 'number' || str === 'textarea' ;
            };

            var changeDocumentType = function(value) {
                if (value === '患者报告')
                    return 'Self Report';
                var arr = value.split('_');
                for (var i = 0; i < arr.length; i++) {
                    var str = arr[i];
                    if (documentTypeTranslation[str]) {
                        return value.replace(str, documentTypeTranslation[str]);
                    }
                }
            };

            var matchIndexValue = function(key, value, subOptions, subOptionsEn) {
                if (!subOptions.hasOwnProperty(key) || !subOptionsEn.hasOwnProperty(key) || subOptions[key].indexOf(value) < 0)
                    return '';
                else
                    return subOptionsEn[key][subOptions[key].indexOf(value)];
            };

            var matchMultiIndexValue = function(key, value, subOptions, subOptionsEn) {
                if (!subOptions.hasOwnProperty(key) || !subOptionsEn.hasOwnProperty(key))
                    return '';
                else {
                    for (var i = 0; i < value.length; i++) {
                        // var ele = value[i];
                        if (subOptions[key].indexOf(value[i]) >= 0) {
                            value[i] = subOptionsEn[key][subOptions[key].indexOf(value[i])];
                        }
                    }
                    return value;
                }
            };

            // ng-repeat filter, 如果有 newLineSource， 排除properties里面的source
            $scope.newLineSource = function(newLineSource) {
                return function(property) {
                    return !newLineSource || property !== 'source';
                }
            }

            // ng-repeat filter, 只有女性显示更年期状态
            $scope.femaleFilter = function(medicalRecord) {
                return function(key){
                    return key !== 'menstrualPeriod' || medicalRecord.patientGender.value === '女';
                }
            }

            // ng-repeat filter, 只有女性显示更年期状态, En
            $scope.femaleFilterEn = function(medicalRecordEn) {
                return function(key){
                    return key !== 'menstrualPeriod' || medicalRecordEn.patientGender.value === 'Female';
                }
            }

            $scope.matchProperty = function(key) {
                console.log(key);
                // console.log(kk);
                // console.log(vv);
            }


            var loadMedicalRecordPattern = function(data) {
                $scope.medicalRecords = [];
                for (var i = 0; i < data.length; i++) {
                    idArr.push(data[i]._id);
                    var tmp = angular.copy(MedicalRecordPattern);
                    for (var key in data[i]) {
                        if (!data[i].hasOwnProperty(key)) continue;
                        if (!tmp.hasOwnProperty(key)) continue;

                        tmp[key].value = data[i][key];
                    }
                    // MedicalRecordPattern里面没有_id和openid
                    tmp._id = data[i]._id;
                    tmp.openid = data[i].openid;
                    tmp.dicomCaseNumber = data[i].dicomCaseNumber;


                    // messageService.publish('medicalRecord', {
                    //     patient_disease: tmp["patient_disease"].value,
                    //     patient_disease_condition: data[i]["patient_disease_condition"]
                    // });

                    $scope.medicalRecords.push(tmp);
                }
                $scope.$emit('transfer.md', {
                    medicalRecords: $scope.medicalRecords,
                    menu: $scope.menu
                });

            };

            $scope.updateMedicalRecord = function(index, id) {
                if ($scope.updateDisable) {
                    alert('更新数据中，请稍后再试!');
                    return false;
                }

                $scope.updateDisable = true;
                var newMedicalRecord = {};
                $scope.medicalRecord = $scope.medicalRecords[index];
                for (var key in $scope.medicalRecord) {
                    if (!$scope.medicalRecord.hasOwnProperty(key))
                        continue;
                    if(key === '_id' || key === 'openid')
                        continue;
                    if(key === 'patientTags'){
                        newMedicalRecord[key] = $scope.medicalRecord[key].value.map(function(obj){
                            return obj.text;
                        });
                        continue;
                    }
                    newMedicalRecord[key] = $scope.medicalRecord[key].value;
                }

                if ($scope.medicalRecord.en) {

                    var newMedicalRecordEn = {};
                    for (var key in $scope.medicalRecord.en) {
                        if (!$scope.medicalRecord.en.hasOwnProperty(key)) continue;
                        if(key === 'patientTags'){
                            newMedicalRecordEn[key] = $scope.medicalRecord.en[key].value.map(function(obj){
                                return obj.text;
                            });
                            continue;
                        }
                        newMedicalRecordEn[key] = $scope.medicalRecord.en[key].value;
                    }
                    newMedicalRecord.en = newMedicalRecordEn;
                }

                // 已翻译
                if($scope.tran){
                    newMedicalRecord.translated = true;
                }

                // 新增病例无openid, dicomCaseNumber
                if ($scope.medicalRecord.new) {
                    newMedicalRecord.openid = $scope.openid;
                    newMedicalRecord.dicomCaseNumber = "QTCDCM" + (new Date()).getTime();
                }



                $http.post('/cs/mdr/updateMedicalRecord', {
                    medicalRecord: newMedicalRecord,
                    id: id  // 新病历传递的id undefined，后端由此判断是新病历
                }).then(function success(result) {
                    if (result && result.data) {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('保存成功!')
                                .position('top right')
                                .hideDelay(2000)
                        ).then(function(response) {
                            if ($scope.source === 'answer_chat') {
                                getMedicalRecordOfUser($scope.openid);
                            }
                            else if($scope.source.startsWith('medical_record')){
                                history.back();
                            }
                            else{
                                $scope.updateDisable = false;
                            }
                        });
                    }
                    else{
                        $scope.updateDisable = false;
                    }
                }, function failure() {
                    $scope.updateDisable = false;
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('保存失败，请稍后再试')
                            .position('top right')
                            .hideDelay(2000)
                    )
                });

            };

            // 将 ISO date string 转成 timestamp
            var getFinalValue = function(obj) {
                if (obj.type === 'date' && obj.value && typeof(obj.value) !== 'number') {
                    return Date.parse(obj.value);
                }
                if (obj.type === 'mnform' || obj.type === 'image_file') {
                    var finalValue = JSON.parse(JSON.stringify(obj.value));
                    for (var i = 0; i < finalValue.length; i++) {
                        var item = finalValue[i];
                        for (var key in item) {
                            if (item[key] && obj.filter[key] === 'date' && typeof(item[key]) !== 'number') {
                                item[key] = Date.parse(item[key]); // date obj to string;
                            }
                        }
                    }
                    return finalValue;

                }
                return obj.value; // 将'category_xxx' 排除
            };

            $scope.createNewMedicalRecord = function() {
                if ($scope.updateDisable) {
                    alert('更新数据中，请稍后再试!');
                    return false;
                }
                var tmp = angular.copy(MedicalRecordPattern);
                tmp.new = true;
                var timestamp = (new Date()).getTime().toString();
                tmp.patientName.value = '新病人';
                if (!$scope.medicalRecords)
                    $scope.medicalRecords = [];
                $scope.medicalRecords.push(tmp);
            };

            $scope.openModalImage = function(imageSrc) {
                ZLCsService.openModalImage(imageSrc);
            };

            $scope.nonForm = function(index) {
                return function(key) {
                    return $scope.medicalRecords[index][key].type !== 'mnform' && $scope.medicalRecords[index][key].type !== 'm1form';
                }
            };

            $scope.isForm = function(index) {
                return function(key) {
                    return $scope.medicalRecords[index][key].type === 'mnform' || $scope.medicalRecords[index][key].type === 'm1form';
                }
            };

            $scope.deleteItem = function(key, index, mindex) {
                $scope.medicalRecords[mindex][key].value.splice(index, 1);
            };

            $scope.deleteItemEn = function(key, index, mindex) {
                $scope.medicalRecords[mindex].en[key].value.splice(index, 1);
            };


            $scope.addItem = function(key, mindex) {
                var inserted = {};
                var properties = $scope.medicalRecords[mindex][key].properties;
                properties.forEach(function(property) {
                    if(property === 'source')
                        inserted[property] = '患者报告';
                    else
                        inserted[property] = null;
                });

                $scope.inserted = inserted;
                if(key === "patientQuestions"){
                    $scope.inserted.id = (new Date().getTime()).toString();
                }
                $scope.medicalRecords[mindex][key].value.push($scope.inserted);
            };

            $scope.addItemEn = function(key, mindex) {
                var inserted = {};
                var properties = $scope.medicalRecords[mindex].en[key].properties;
                properties.forEach(function(property) {
                    if(property === 'source')
                        inserted[property] = 'Self Report';
                    else
                        inserted[property] = null;
                });

                $scope.inserted = inserted;
                $scope.medicalRecords[mindex].en[key].value.push($scope.inserted);
            };

            $scope.deleteFile = function(key, mindex, index) {
                $scope.medicalRecords[mindex][key].value.splice(index, 1);
            };

            $scope.getFileNameList = function(mindex) {
                var fileNameList = $scope.medicalRecords[mindex].documents.value.map(function(doc) {
                    return  (doc.documentType ?  doc.documentType + '_' : '') + (doc.visitDate ? showDate(doc.visitDate) : '');
                });
                //fileNameList.push('患者报告');
                return ZLCsService.uqArray(['患者报告'].concat(fileNameList));
            };

            $scope.getFileNameListEn = function(mindex) {
                var fileNameList = $scope.medicalRecords[mindex].documents.value.map(function(doc) {
                    return (doc.documentType ? documentTypeTranslation[doc.documentType] + '_' : '') + (doc.visitDate ?  showDate(doc.visitDate) : '');
                });
                // fileNameList.push('Self Report');
                return ZLCsService.uqArray(['Self Report'].concat(fileNameList));
            };

            var showDate = function(date) {
                var newDate = new Date(date);
                return (newDate.getMonth() + 1).toString() + '/' + newDate.getDate() + '/' + newDate.getFullYear();
            };

            $scope.uploadDicom = function () {
                var dicomUploadLink = "https://qtclinics.ambrahealth.com/api/v3/link/redirect?uuid=d1057ad7-1c77-46b4-b115-dff3f0c399ae&email_address=integrationuser@quantum.com&suppress_notification=1";
                window.open(dicomUploadLink, '_blank');
            };

            $scope.uploadFile = function(files, mdDocuments, translation) {
                console.log('translation is: ' + translation);
                var myToast = $mdToast.show({
                    template  : '<md-toast>上传中...</md-toast>',
                    hideDelay : 0,
                    position  : 'top right'
                });

                var data = new FormData();
                angular.forEach(files, function(value) {
                    data.append("files[]", value);
                });

                $http({
                    method: 'POST',
                    url: '/cs/uploadFile',
                    data: data,
                    withCredentials: true,
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined },
                }).then(function(res) {
                    $mdToast.hide();
                    console.log(res.data);

                    if (res.data) {
                        if(translation){
                            // 给一个已上传的病例文件添加翻译文件
                            addTranslationFile(res.data, mdDocuments);
                        }
                        else {
                            // 上传病历文件
                            addFileToMedicalRecord(res.data, mdDocuments);
                        }
                    }
                });
            };

            $scope.downloadFile = function(link) {
                /*
                老的数据结构，document.url: http://zlzhidao-resource.oss-cn-shenzhen.aliyuncs.com/user_file/1532202243220RKWQE7A72WT3NEKF.xlsx
                新的数据结构，document.ossFileKey: user_file/1532202243220RKWQE7A72WT3NEKF.xlsx
                link用 document.url 或者 document.ossFileKey 在html中判断
                 */
                var fileKey = ZLCsService.removeLeadingHttp(link).replace(CsConst.OSS.URL_HEAD, "");
                window.open("/cs/getOssFileWithKey?fileKey=" + fileKey,"_self")

                /* 本地存储，弃用
                if(url){
                    $http.get('/cs/downloadFile', {
                        //responseType:'arraybuffer', 有时要 arraybuffer， strange
                        responseType: 'blob',   // Angular parse the response as JSON as default
                        params: {
                            url: url
                        }
                    }).then(function (res) {
                        saveFileAs(res,url);
                    });
                }
                */
            };

            function saveFileAs(response,url) {
                var blob = new Blob([response.data]);
                var fileName = url.replace('http://zlzhidao-resource.oss-cn-shenzhen.aliyuncs.com/user_file/','');
                saveAs(blob, fileName);
            }

            var addFileToMedicalRecord = function(data, mdDocuments) {
                data.forEach(function(file) {
                    mdDocuments.value.unshift({
                        ossFileKey: file.ossFileKey,
                        documentName: file.filename,
                        documentCategory: '',
                        documentType: '',
                        institution: '',
                        providerName: '',
                        visitDate: null,
                        comments: '',
                        documentId: ''

                    });
                });
            };

            var addTranslationFile = function(data, mdDocuments) {
                data.forEach(function(file) {
                    mdDocuments.push({
                        ossFileKey: file.ossFileKey,
                        documentName: file.filename,
                    });
                });
            };

            //ng-if="source === 'answer_chat' "
            $scope.mdConnectControl = function () {
                $scope.showmdConnectSection = !$scope.showmdConnectSection;
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

            $scope.validOpenid = function(item){
                return item.openid !== $scope.openid;
            };

            $scope.connectMD = function () {
                if(!$scope.dataModel.mdToConnect._id){
                    alert('请选择完整的病历信息!');
                    return false;
                }
                if($scope.dataModel.mdToConnect.openid){
                    alert('该病历已经关联微信用户!');
                    return false;
                }
                $http.post('/cs/mdr/connectMd', {
                    mdId:$scope.dataModel.mdToConnect._id,
                    openid:$scope.openid
                }).then(function success(res) {
                    if(res.data.status === 'ok'){
                        getMedicalRecordOfUser($scope.openid);
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('关联成功')
                                .position('top right')
                                .hideDelay(2000)
                        )
                    }
                    else{
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('关联失败，请联系技术人员')
                                .position('top right')
                                .hideDelay(2000)
                        )
                    }
                }, function failure(err) {
                    console.log(err);
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('关联失败，请联系技术人员')
                            .position('top right')
                            .hideDelay(2000)
                    )
                });
            };

            $scope.isImage = function (fileName) {
                var ext = fileName.split('.').pop().toUpperCase();
                return ['JPG','JPEG','PNG'].indexOf(ext) !== -1;
            };

            $scope.refreshDicom = function (dicomCaseNumber) {
                $http.post('/cs/refreshDicom', {
                    dicomCaseNumber,
                }).then(function(result) {
                    if (result && result.data) {
                        angular.forEach(result.data.content,function (accsNumber) {
                            angular.forEach($scope.medicalRecords,function (medicalRecord) {
                                var studies = $filter('filter')(medicalRecord.dicomFiles.value, {accessionNumber: accsNumber });
                                if(!studies.length){
                                    medicalRecord.dicomFiles.value.push({
                                        accessionNumber: accsNumber,
                                        documentName: '',
                                        documentType: '',
                                        institution: '',
                                        providerName: '',
                                        visitDate: null,
                                        comments: '',
                                        documentId: '',
                                    });
                                }
                            });
                        });

                    }
                });
            };

            $scope.getDicomLink = function (accessionNumber) {
                $http.post('/cs/getDicomLink', {
                    accessionNumber:accessionNumber
                }).then(function(result) {
                    if (result && result.data) {
                        var v = result.data.content;
                        var dicomLink = "https://qtclinics.ambrahealth.com/api/v3/link/external?u=faacb9c4-48c8-42f1-a6a3-236d45f9441c&v=" + window.encodeURIComponent(v);
                        window.open(dicomLink, '_blank');
                    }
                });
            };


            var initParams = function() {
                $scope.updateDisable = false;
                $scope.menu = {
                    basic: ['patientName', 'patientMobile', 'patientAddress', 'patientInsurance',  'patientGender', 'patientBirthday','patientRelativeName', 'patientRelativeMobile', 'treatmentLocation', 'treatmentHospitalName', 'treatmentDoctorName', 'treatmentDepartmentName', 'treatmentHospitalMobile', 'patientWeight', 'patientHeight'],

                    //诊疗经过
                    process:['treatmentHistory'],

                    //诊断信息
                    diagnostic: ['presentDiagnosis', 'diseaseLocation', 'metastases', 'geneMutations','proteinExpression', 'tumorMutationBurden','MMRstatus','ecog', 'kps', 'currentCondition'], //'currentCondition_description', 'currentCondition_date',

                    //治疗信息
                    treatment: ['treatmentSummary','currentMedications', 'chemotherapy', 'radiotherapy', 'targetedTherapy', 'hormoneTherapy', 'immunotherapy', 'chineseTherapy', 'otherTherapy'], //'imagingAndRadiology', 'pathologyAndCytology', 'molecularTests', 'recentLabs'

                    //医疗史
                    medicalHistory: [ 'briefTreatment','majorDisease', 'majorTrauma', 'otherCancer', 'surgicalHistory', 'familyHistoryCancer', 'familyHistoryGenetic', 'allergies', 'martialStatus', 'smoking', 'drinking', 'drugUse', 'menstrualPeriod'],

                    //问题总结 => delete
                    md_question: ['patientQuestions'],

                    //病历文件
                    logs:['followUps',],

                    //Dicom文件
                    dicoms:['dicomFiles',],
                };


            };

        }]);