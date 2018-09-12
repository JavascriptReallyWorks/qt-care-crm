/**
 * Created by Yang1 on 8/10/17.
 */

angular.module('MultiChat',[
    'ui.router',
    'ZLSysApp.unsafe-filter',
    'ngMaterial',
    "ui.bootstrap"
])
    .factory('Socket', GET_SOCKET_FUNCTION)
    .factory('PubSub', PUB_SUB_FUNCTION)
    .controller('MultiChatCtrl', ['$scope', '$state', '$filter', '$stateParams', '$http', '$filter','Socket', 'PubSub',
        function ($scope, $state, $filter, $stateParams, $http, filter, Socket, PubSub) {

            $scope.initMultiChatCtrl = function () {
                $scope.curMessages = [];
                $scope.curConvType = '人工回复';
                $scope.curReplyType = 230;

                $scope.input = {};
                queryCurUser();
            };

            $scope.$on('$destroy', function (event) {
                PubSub.unSubscribeAll();
            });

            $scope.sendMessage = function () {
                if(!$scope.input.newMessage){
                    alert('请输入信息');
                    return false;
                }
                var options = {
                    tableName: 'messages',
                    method: 'POST'
                };

                var data = {
                    content:$scope.input.newMessage,
                    msgType:'text',
                    clientId:$scope.curConv.clientId,
                    fromUserId:$scope.user._id,
                    fromUserName:$scope.user.nickname || $scope.user.name,
                    createdAt:(new Date()).getTime(),
                };

                PubSub.publish(options,data);

                $scope.input.newMessage = '';
            };

            var getConversations = function () {
                PubSub.unSubscribeAll();
                var options = {
                    tableName: 'conversations',
                    method: 'GET',
                    condition:{
                        replyType:$scope.curReplyType
                    },
                    paging:{
                        from:'last',
                        page:1,
                        pageSize:10
                    }
                };
                PubSub.get(options, function (data) {
                    $scope.$apply(function () {
                        console.log('total: ' + data.count + ' conversations');
                        $scope.convs = [];
                        for(var i=0; i<data.conversations.length; i++){
                            $scope.convs.push(data.conversations[i]);
                        }
                        angular.forEach($scope.convs, function (conv) {
                            subscibeConvUpdate(conv);
                        });
                        listenNewConversation();
                    });
                });
            };

            var subscibeConvUpdate = function (conv) {
                var options = {
                    tableName:'conversations',
                    method:'PUT',
                    modelId:conv.clientId
                }
                PubSub.subscribe(options, function (update) {
                    var theConv = $filter('filter')($scope.convs, {$id: conv.$id})[0];
                    if(theConv) {
                        if (update.replyType && update.replyType !== $scope.curReplyType) {       //  replyType改变
                            var idx = $scope.convs.indexOf(theConv);
                            $scope.$apply(function () {
                                $scope.convs.splice(idx,1);
                            });
                        }
                        else {
                            $scope.$apply(function () {
                                angular.merge(theConv, update);
                            });
                        }
                    }
                });
            };

            var getOldMessage = function (clientId) {
                var options = {
                    tableName: 'messages',
                    method: 'GET',
                    condition:{
                        clientId:clientId
                    },
                    paging:{
                        from:'last',
                        page:1,
                        pageSize:10
                    }
                };
                PubSub.get(options, function (data) {
                    $scope.$apply(function () {
                        console.log('total: ' + data.count + ' messages');
                        for(var i=0; i<data.messages.length; i++){
                            $scope.curMessages.push(data.messages[i]);
                        }
                    });
                    doScrollTop();
                });
            };

            var listenNewMessage = function (clientId) {
                var options = {
                    tableName: 'messages',
                    method: 'POST',
                    condition:{
                        clientId:clientId
                    }
                };
                PubSub.subscribe(options, function (msg) {
                    $scope.$apply(function () {
                        $scope.curMessages.push(msg);
                        doScrollTop();
                    });
                });
            };

            var listenNewConversation = function (clientId) {
                var options = {
                    tableName: 'conversations',
                    method: 'POST',
                    condition:{
                        replyType:$scope.curReplyType
                    }
                };
                PubSub.subscribe(options, function (conv) {
                    $scope.$apply(function () {
                        $scope.convs.unshift(conv);
                        subscibeConvUpdate(conv);
                    });
                });
            };


            var getCurConversation = function (modelId) {
                var options = {
                    tableName: 'conversations',
                    method: 'GET',
                    modelId:modelId
                };
                PubSub.get(options, function (conv) {
                    console.log('current conversations is :' + JSON.stringify(conv,null,4));
                });
            };



            var queryCurUser = function () {
                $http.post('/pubsub/getUser').then(function (res) {
                    if (res && res.data) {
                        $scope.user = res.data;
                        getConversations();
                    }
                });
            };

            $scope.joinChat = function (id) {
                if($scope.selectedId === id) return false;
                $scope.curConv = $filter('filter')($scope.convs,{$id:id})[0];
                $scope.selectedId = id;
                $scope.curMessages = [];
                PubSub.unSubscribeMessage();

                getCurConversation($scope.curConv.clientId); // 测试用
                getOldMessage($scope.curConv.clientId);
                listenNewMessage($scope.curConv.clientId);
            };

            $scope.changeConvType = function (type) {
                if($scope.curConvType !== type){
                    $scope.curConvType = type;
                    $scope.curReplyType = type === '人工回复' ? 230 : 310;
                    getConversations();
                }
            };

            $scope.login = function () {
                if(!$scope.input.user){
                    alert('请输入用户名');
                    return false;
                }
                $http.post('/pubsub/login',{
                    name:$scope.input.user
                }).then(function (res) {
                    if (res && res.data) {
                        $scope.user = res.data;
                        getConversations();
                    }
                    $scope.input.user = '';
                });
            };

            var doScrollTop = function () {
                //在view更新后，获取消息显示的高度，将滚动条滚动到底部
                setTimeout(function () {
                    var height = $(".messages ul").height();
                    $(".messages").scrollTop(height)
                },300);
            };

            $scope.displayTime = function (timestamp) {
                var time = new Date(timestamp);
                var year = time.getFullYear();
                var month = time.getMonth() + 1;
                var date = time.getDate();
                var hour = time.getHours();
                var minute = time.getMinutes();
                var second = time.getSeconds();
                return year + '/' + month + '/' + date + ' ' + hour + ':' + minute + ':' + second
            };

            $scope.convertTextFromEsTpl = function(message) {
                var contents = [];
                var hits = message.hits;
                if (hits) {
                    for (var i = 0; i < hits.length; i++) {
                        var article = hits[i]._source;
                        if (!article.url) {
                            article.url = "https://www.zlzhidao.com/qau/view/" + hits[i]._id.toString() + "/" + article.title_id.toString()
                        }

                        var hl_content = hits[i].highlight ? (hits[i].highlight.content || "") : "";
                        if(hl_content && hl_content.length > 40){
                            hl_content = hl_content.substring(0,40)+"..."
                        }
                        var content = "<a target='_blank' href='" + article.url + "'>" + hits[i]._source.title + "</a>" + (hl_content || "");
                        contents.push(content);
                    }
                }
                return contents.join("</br>");
            };

            $scope.convertContent = function (content) {
                return content.replace("\\n","</br>")
            };

            $scope.endChat = function () {
                PubSub.manualConvToAuto($scope.curConv.clientId);
            };
        }
    ]);

angular.module('ZLSysApp.unsafe-filter', [])
    .filter('unsafe', function($sce) { return $sce.trustAsHtml; });