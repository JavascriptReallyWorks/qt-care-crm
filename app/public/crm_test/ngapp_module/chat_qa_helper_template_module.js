'use strict';


angular.module('ZLCsApp.chat_qa_helper_template_module', [

])
    .controller('ChatQaHelperTemplateController', ['$scope', '$location','$state', '$filter','$element','$q' , '$stateParams', '$http', 'ZLCsService', '$mdToast', '$mdDialog','CsConst',

        function ($scope, $location, $state, $filter,$element,$q, $stateParams, $http, ZLCsService, $mdToast, $mdDialog, CsConst) {
            'ngInject';

            var tagsChanged = undefined; //每次搜索的tags有变化时为true，变化后第一次发消息后设为false
            var pureTags = undefined;
            var pageSize;

            $scope.initChatQaHelperTemplateCtrl = function() {
                initParams();

                /*$scope.$on('ZLCsApp.xxx', function(event, arg) {
                    if (arg) {
                        $scope.source = arg.source;
                    }
                });*/
            };


            var initParams = function() {

            };

            $scope.loadTags = function($query) {
                return $http.get('cs/qa/getTags', { cache: true }).then(function(response) {
                    var tags = response.data;
                    return tags.filter(function(tag) {
                        return tag.toLowerCase().indexOf($query.toLowerCase()) != -1;
                    });
                });
            };

            $scope.initTagsCategory = function(save) {

                $scope.select_tags = [];
                $scope.tags_arr = [];
                $scope.new_tags = [];


                var promise = $scope.changeTagSelect();
                var select_tags_p = [];
                var index = 0;
                promise.then(function(select_tag) {
                    if (select_tag) {
                        if ($scope.qas_arr_name && $scope.qas_arr_name.match(/,/, 'g')) {
                            next()
                        }
                    } else {
                        $scope.changeTagSelect();
                    }
                });

                function next() {
                    var arr = $scope.qas_arr_name.split(",");
                    p(arr[index]).then(function(r) {
                        if (r) {
                            index++;
                            next();
                        }
                    }, function(err) {

                    });
                }

                var p = function(wd) {
                    var defer = $q.defer();
                    select_tags_p.push(wd);
                    var url = '/auth/manager/tags/getSubTags?1=1&r_tag=' + select_tags_p.join(",");

                    $http.get(url).then(function(response) {

                        var result = response.data;
                        if (result.join("").length < 1) {
                            defer.reject(false);
                            return false;
                        }
                        //判断是否生成问答
                        $scope.qa_tags_obj = undefined;
                        if (result && (Array.isArray(result) && result[0] && result[0].qa_expression)) {
                            $scope.qa_tags_obj = result[0];
                            if (!save) {}
                            defer.reject(false);
                            return false;
                        }
                        defer.resolve(true);
                        $scope.select_tags = select_tags_p;
                        $scope.newTags = result.tags;
                        $scope.tags_arr.push(result);

                        if (!save) {}
                    },function (res) {
                        console.log(res)
                    });

                    return defer.promise;
                }

            };

            //级联下拉
            $scope.changeTagSelect = function(select_tag, index) {

                var deferred = $q.defer();

                if (index != undefined) {
                    $scope.index = index;
                    $scope.tags_arr.splice(index + 1, $scope.tags_arr.length);
                    $scope.select_tags.splice(index + 1, $scope.select_tags.length);
                    if (select_tag == "") {
                        return false;
                    }
                }

                if (!$scope.tags) {
                    $scope.tags = [];
                }
                var query_tags = [];
                for (var n = 0; n < $scope.select_tags.length; n++) {
                    query_tags.push({
                        "text": $scope.select_tags[n]
                    })
                }
                $scope.tags = query_tags;
                $scope.tagChanged();



                var url = '/cs/tags/getSubTags?1=1';
                if (select_tag) {
                    url += "&r_tag=" + $scope.select_tags.join(",");
                }
                $http.get(url).then(function(response, status, headers) {
                    var result = response.data;
                    //判断是否生成问答
                    $scope.qa_tags_obj = undefined;
                    if (result && (Array.isArray(result) && result[0] && result[0].qa_expression)) {
                        $scope.qa_tags_obj = result[0];
                        deferred.resolve(false);
                        return false;
                    } else if (result) {
                        if (result.join("").length < 1) {
                            return false;
                        }
                        $scope.newTags = result.tags;
                        $scope.tags_arr.push(result);

                        deferred.resolve(select_tag || true);

                    } else {
                        deferred.resolve(false);
                    }
                });

                return deferred.promise;
            };

            $scope.searchTerm;
            $scope.clearSearchTerm = function() {
                $scope.searchTerm = '';
            };
            $element.find('input').on('keydown', function(ev) {
                ev.stopPropagation();
            });
            $scope.onSearchChange = function(event) {
                event.stopPropagation();
            };
            $scope.tagChanged = function() {
                if ($scope.tags && $scope.tags.length > 0) {
                    pureTags = [];
                    angular.forEach($scope.tags, function(tag, idx) {
                        pureTags.push(tag.text);
                    });
                    searchQaByTags(pureTags);
                }
            };


            var searchQaByTags = function(tags) {
                $http.post('/cs/qa/searchQa', {
                    cond: {
                        text: tags.join(" ")
                    },
                    page: 1,
                    limit: 20
                }).then(function(response, status, headers) {
                    if (response && response.data) {
                        $scope.qaHits = response.data;
                    }else {
                        $scope.qaHits = null;
                    }
                });
            };


        }]);
