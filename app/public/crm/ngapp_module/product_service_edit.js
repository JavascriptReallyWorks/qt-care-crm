'use strict';

import ngFileUpload from 'ng-file-upload'

export default angular.module('ZLCsApp.product_service_edit', [
    ngFileUpload
])
    .controller('editProductQueryCtrl', ['$scope', '$state', '$filter', '$stateParams', '$compile', '$timeout', '$http', '$mdToast','Upload',

        function ($scope, $state, $filter, $stateParams, $compile, $timeout, $http, $mdToast,Upload) {
            $scope.initEditProductQueryCtrl = function () {
                var id = $stateParams.id;
                if (id) {
                    $http({
                        method: 'get',
                        url: '/cs/product/findOneProduct?id='+id,
                    }).then(function successCallback(res) {
                        $scope.product = res.data.content;
                    }, function errorCallback(res) {
                        console.log(res)
                    });
                }
                $scope.productTypes = [
                    {
                        display:"服务",
                        value:"服务"
                    }
                ];
                $scope.productStatus = [
                    {
                        display:"上线",
                        value:200
                    },
                    {
                        display:"下线",
                        value:300
                    }
                ]
            };
            $scope.froalaOptions = {
                htmlExecuteScripts:true,
                htmlAllowedAttrs: [
                    'title', 'href', 'alt', 'src', 'style','onClick',
                    'ng-style','ng-click', 'ng-style', 'ng-bind-html', 'ng-mouseleave', 'ng-mouseover'
                ],
                htmlRemoveTags: [''],
                // htmlAllowedTags: ['script', 'style', 'base']
            };

            $scope.saveAndUpdateProduct = function () {

                $http({
                    method: 'POST',
                    url: '/cs/product/saveAndUpdateProduct',
                    data: {product: $scope.product}
                }).then(function successCallback(response) {
                    $mdToast.show({
                        hideDelay: 3000,
                        position: 'top right',
                        templateUrl: '/cs/cs_partials/success_template'
                    });
                    $state.go("cs.product_service")
                }, function errorCallback(response) {
                    $mdToast.show({
                        hideDelay: 3000,
                        position: 'top right',
                        templateUrl: '/cs/cs_partials/fail_template'
                    });
                });
            };

            $scope.uploadFiles = function (files,filed) {
                if (files && files.length) {
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        Upload.upload({
                            url: '/upload/upload_image',
                            data: {file: file}
                        }).then(function (resp) {
                            var thumb_url = resp.data.link;
                            if(!$scope.product){
                                $scope.product = {};
                            }
                            if(filed === "product_images"){
                                if(!$scope.product.product_images){
                                    $scope.product.product_images = [];
                                }
                                $scope.product.product_images.push(thumb_url);
                            }

                            if(filed === "subscribe_img"){
                                $scope.product.subscribe_img = thumb_url;
                            }
                            if(filed === "title_img"){
                                $scope.product.title_img = thumb_url;
                            }


                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent('图片上传成功!')
                                    .position('top right')
                                    .hideDelay(2000)
                            );
                        }, function (resp) {
                            console.log('Error status: ' + resp.status);
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent('图片上传失败，请重试!')
                                    .position('top right')
                                    .hideDelay(2000)
                            );
                        }, function (evt) {
                            // console.log(evt)
                            // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file);
                        });
                    }



                }

            };

        }]);

