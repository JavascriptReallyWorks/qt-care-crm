/**
 * Created by Yang1 on 7/31/17.
 */
'use strict';

import socketPubsub from '../socket_pubsub'
import angularNicescroll from '../../components/angular-nicescroll/angular-nicescroll'
import '../../chat.css'

export default angular.module('ZLCsApp.answer_chat_manager', [
    angularNicescroll,
])
    .factory('Socket', socketPubsub.GET_SOCKET_FUNCTION)
    .factory('PubSub', socketPubsub.PUB_SUB_FUNCTION)
    .controller('answerChatManagerCtrl', ['$rootScope','$scope', '$state', '$filter', '$q','$stateParams', '$http','$timeout','$element','$mdDialog','$mdToast','ZLCsService', "CsConst",'Socket', 'PubSub',
        function ($rootScope,$scope, $state, $filter, $q,$stateParams,$http,$timeout,$element,$mdDialog,$mdToast,ZLCsService,CsConst,Socket, PubSub) {

            var csUserMapping = {};
            // const CONV_PAGE_SIZE = 30;
            const CONV_PAGE_SIZE = 10;
            const MESSAGE_PAGE_SIZE = 30;

            const ADMIN_CHANNEL = 'admin';
            const CHAT_CHANNEL = 'chat';  // 发 & 查询

            var timeoutPromise;
            var delayInMs = 1000;

            var replyTypeRoleMap = {
                230:'qt_cs',
                310:'自动回复',
            };


            var initParams = function () {
                $scope.convTypeOptions = [
                    {
                        display:'全部对话',
                        value:100,
                    },
                    {
                        display:'有效对话',
                        value:200,
                    },
                ];

                $scope.curConvType = 100;
                $scope.loadMoreConvCtrl = false;
                $scope.convs = [];

                $scope.selectedId = '';

            };

            $scope.curConvTypeDisplay = function () {
                return $scope.convTypeOptions.filter(function (option) {
                    return option.value === $scope.curConvType;
                })[0].display;
            };

            $scope.initAnswerChatManager = function () {
                initParams();

                queryCurUser();
                //查询客服用户
                queryCrmUsers();

            };

            var initPubsubListeners = function () {
                PubSub.subscribe(ADMIN_CHANNEL, function (data) {
                    const {operation, payload} = data;
                    const option = (operation.method + '_' + operation.table).toUpperCase();
                    switch(option){
                        case 'POST_ONE_CONVERSATION':
                            if($scope.curConvType === 100 && !$scope.clientName) {   //搜索时不添加
                                $scope.$apply(function () {
                                    $scope.convs.unshift(payload);
                                });
                            }
                            break;

                        case 'POST_ONE_INTERACTIVE_CONVERSATION':
                            if($scope.curConvType === 200 && !$scope.clientName) {   //搜索时不添加
                                $scope.$apply(function () {
                                    $scope.convs.unshift(payload);
                                });
                            }
                            break;

                        case 'PUT_ONE_CONVERSATION':
                            var theConv = $filter('filter')($scope.convs, { _id: payload._id })[0];
                            if(theConv) {
                                $scope.$apply(function () {
                                    angular.merge(theConv, payload);
                                });
                            }
                            else{   //修改对话时，如果之前未获取就新增，因为修改的对话改变了updatedAt, 点击更多fetch不到
                                if($scope.curConvType === 100 && !$scope.clientName){
                                    $scope.$apply(function () {
                                        $scope.convs.unshift(payload);
                                    });
                                }
                                else if($scope.curConvType === 200 && !$scope.clientName &&  payload.interactive){
                                    $scope.$apply(function () {
                                        $scope.convs.unshift(payload);
                                    });
                                }

                            }
                            break;

                        case 'POST_ONE_MESSAGE':
                            if(payload.clientId === $scope.clientId){
                                $scope.$apply(function() {
                                    $scope.curMessages.push(payload);
                                    doScrollTop();
                                });
                            }
                            break;
                    }
                });

                // 监听'chat'，返回查询的对话和消息
                PubSub.subscribe(CHAT_CHANNEL, function (data) {
                    const {operation, payload} = data;
                    const option = (operation.method + '_' + operation.table).toUpperCase();
                    switch(option){
                        case 'GET_MULTI_MESSAGE':
                            // console.log('total: ' + payload.count + ' messages');
                            var newMessages = [];
                            for (var i = 0; i < payload.messages.length; i++) {
                                newMessages.push(payload.messages[i]);
                            }
                            $scope.$apply(function() {
                                $scope.curMessages = newMessages.concat($scope.curMessages);
                                $scope.loadMoreCtrl = (payload.count > MESSAGE_PAGE_SIZE * $scope.curMessagePage);
                            });
                            doScrollTop();
                            break;

                        case 'GET_MULTI_CONVERSATION':
                            $scope.$apply(function() {
                                // console.log('total: ' + payload.count + ' conversations left');
                                $scope.loadMoreConvCtrl = payload.count > CONV_PAGE_SIZE;
                                for (var i = 0; i < payload.conversations.length; i++) {
                                    $scope.convs.push(payload.conversations[i]);
                                }
                            });
                            break;
                    }
                })
            };

            $scope.getConversations = function () {
                var options = {
                    condition:{},
                    paging:{
                        from:'last',
                        page:1,
                        pageSize:CONV_PAGE_SIZE
                    }
                };
                if($scope.clientName)
                    options.condition.clientName = $scope.clientName;
                if($scope.curConvType === 100){        //所有对话
                    options.condition.replyType = 'all';
                }
                else{       //有效对话
                    options.condition.interactive = true;
                }
                if($scope.convs.length > 0){
                    // 对话的最小 updatedAt
                    var minUpdatedAt = Math.min.apply(Math, $scope.convs.map(function(conv){return conv.updatedAt;}));
                    options.condition.updatedAt = minUpdatedAt;
                }

                PubSub.publish(CHAT_CHANNEL, {
                    operation:{
                        method:'GET_MULTI',
                        table:'CONVERSATION'
                    },
                    payload:options
                });
            };

            $scope.$watch("clientName", function(newVal, oldValue)  {
                if(newVal !== oldValue){
                    $timeout.cancel(timeoutPromise);  //does nothing, if timeout alrdy done
                    timeoutPromise = $timeout(function(){   //Set timeout
                        $scope.convs = [];
                        clearCurConvData();
                        $scope.getConversations();
                    },delayInMs);
                }
            },true);

            $scope.getMessages = function () {
                $scope.curMessagePage += 1;
                var options = {
                    condition: {
                        clientId: $scope.clientId
                    },
                    paging: {
                        from: 'last',
                        page: $scope.curMessagePage,
                        pageSize: MESSAGE_PAGE_SIZE
                    }
                };

                PubSub.publish(CHAT_CHANNEL,{
                    operation:{
                        method:'GET_MULTI',
                        table:'MESSAGE'
                    },
                    payload:options
                });
            };


            var clearCurConvData = function () {
                $scope.curConv = undefined;
                $scope.curMessages = [];
                $scope.selectedId = '';
                $scope.clientId = '';
                $scope.loadMoreCtrl = false;
            };


            $scope.changeConvType = function (type) {   // 100 or 200
                if($scope.curConvType !== type){
                    $scope.convs = [];
                    clearCurConvData();
                    $scope.loadMoreConvCtrl = false;
                    $scope.curConvType = type;
                    $scope.getConversations();
                }
            };

            //查询客服角色 csUserMapping
            var queryCrmUsers = function () {
                $http.post('/cs/findCrmUserMap').then(function (res) {
                    if (res && res.data) {
                        $scope.crmUserMap  = res.data.content;
                        for(var i=0; i<$scope.crmUserMap.length; i++){
                            var users = $scope.crmUserMap[i].users;
                            angular.forEach(users,function (user) {
                                csUserMapping[user.userid] = user.nickname || user.name;
                            });
                            $scope.crmUserMap[i].users.unshift({
                                name:'排队',
                                userid:'all'
                            })
                        }
                    } else {
                        $scope.crmUserMap  = undefined;
                    }
                });
            };


            var playVoice = false;
            $scope.playAudio = function (url, e) {
                var audio = angular.element("#audio")[0];
                audio.src = url;
                if (playVoice) {
                    angular.element(".v_player_pause").removeClass("v_player");
                    //按暂停播放
                    audio.pause();
                    playVoice = false;
                } else {
                    //播放其他
                    audio.play();
                    angular.element(e.target).find(".v_player_pause").addClass("v_player");
                    playVoice = url;
                }

                audio.addEventListener('ended', function () {
                    angular.element(".v_player_pause").removeClass("v_player");
                    playVoice = false;
                }, false);
            };


            //选择用户对话
            $scope.joinChat  = function (id){
                if($scope.selectedId === id)
                    return false;
                $scope.curConv = $filter('filter')($scope.convs,{_id:id})[0];
                $scope.selectedId = id;
                $scope.curMessages = [];

                $scope.clientId = $scope.curConv.clientId;
                $scope.curMessagePage = 0;
                $scope.loadMoreCtrl = false;
                $scope.getMessages();
            };

            $scope.moveChatToManual = function() {
                PubSub.autoConvToManual($scope.clientId, '', function (res) {
                    if(res === 'notavail'){
                        alert('该用户目前处于人工对话中');
                    }
                });
            };

            $scope.convFilter = function (conv) {
                return $scope.curConvType === 100 || conv.replyType === 310 ;
            };


            $scope.delHtmlTag = function (text) {
                return ZLCsService.delHtmlTag(text);
            };

            $scope.setOption = function (option) {
                $scope.option = option;
            };

            $scope.convertContent = function (content) {
                if(content){
                    return content.replace("\\n","</br>")
                }
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

            var doScrollTop = function () {
                //在view更新后，获取消息显示的高度，将滚动条滚动到底部
                setTimeout(function () {
                    var height = $(".messages ul").height();
                    $(".messages").scrollTop(height)
                },300);
            };

            var queryCurUser = function () {
                $http.post('/cs/queryCurUser').then(function (result) {
                    if (result && result.data) {
                        $scope.user = result.data.content;
                        initPubsubListeners();
                        $scope.getConversations();
                    } else {
                        $scope.user = undefined;
                    }
                });
            };

            $scope.showConvTitle = function(conv) {
                var roleStatus = '队列:' + replyTypeRoleMap[conv.replyType]+' | ';
                var messageStatus = conv.replierId ? ('接入:' + csUserMapping[conv.replierId]) : '排队';
                return conv.clientName + ' (' + roleStatus + messageStatus + ')';

            };

            $scope.replierExists = function (conv) {
                return !conv.replierId;
            };

            $scope.moveToOtherUser = function (role, uid, uname) {
                if(!$scope.curConv){
                    alert('请选择对话！');
                    return false;
                }
                var replyType = CsConst.CONVER.ROLE_REPLY_MAP[role];
                if(uid === 'all'){      // 排队
                    if(!$scope.curConv.replierId && replyType === $scope.curConv.replyType){
                        alert('当前对话已在' + role + '中排队！');
                        return false;
                    }
                    transferConv($scope.curConv._id, replyType);
                }
                else{       //指派个人
                    if(uid === $scope.curConv.replierId){
                        alert('当前对话已被该用户接人！');
                        return false;
                    }
                    transferConv($scope.curConv._id, replyType, uid);
                }
            };


            var transferConv = function(conversationId, replyType, replierId) {
                var data;
                if (replierId) { //指派个人
                    data = {
                        _id:conversationId,
                        replyType,
                        replierId,
                    };
                } else { //排队
                    data = {
                        _id:conversationId,
                        replyType,
                    };
                }
                var subMethod = replierId ? ($scope.curConv.replierId ? '1_TO_1' : 'M_TO_1') : ($scope.curConv.replierId ? '1_TO_M':'M_TO_M');
                PubSub.publish(CHAT_CHANNEL, {
                    operation:{
                        method:'PUT_ONE',
                        subMethod,
                        table:'CONVERSATION',
                    },
                    payload:data
                });
            };

            //结束对话 && 没有答案结束对话
            /*
            $scope.endChat = function (inst) {
                var confirmEnd = $mdDialog.confirm()
                    .title('确定要结束会话？')
                    .ariaLabel('del')
                    .ok('确定')
                    .cancel('取消');
                $mdDialog.show(confirmEnd).then(function() {
                    PubSub.manualConvToAuto($scope.clientId);
                    $rootScope.$broadcast('ZLCsApp.medicalRecordTemplateSource', {
                        source:'answer_chat_from_case_medical_record',
                        medical_record_id:""
                    });
                }, function() {

                });
            };
            */

            //结束对话前验证
            function validate() {
                var arr = $filter("filter")($scope.curMessages,{
                    senderId: $scope.user._id,
                });
                if(arr.length < 1){
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('请回复!')
                            .position('top right')
                            .hideDelay(2000)
                    );
                    return false;
                }
                return true;
            }


            //froalaEditor外观
            $scope.froalaOptions = {
                toolbarButtons : [],
                toolbarButtonsMD : [],
                toolbarButtonsSM : [],
                heightMax: 200,
                height: 200
            };

            $scope.opened = {};

            $scope.open = function($event, elementOpened) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened[elementOpened] = !$scope.opened[elementOpened];
            };


            $scope.openModalImage = function (imageSrc) {
                ZLCsService.openModalImage(imageSrc);
            };


        }]);
