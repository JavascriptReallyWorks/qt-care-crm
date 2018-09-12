'use strict';

angular.module('ZLCsApp.answer_chat_view', [
    'ui.router',
    'ngMaterial',
    'ui.bootstrap',
    'angular-nicescroll',
    "ngTagsInput",
    "ZLCsApp.drag-drop-directive",
])
    .factory('Socket', GET_SOCKET_FUNCTION)
    .factory('PubSub', PUB_SUB_FUNCTION)
    .controller('answerChatCtrl', ['$rootScope', '$scope', '$state', '$filter', '$timeout','$q', '$stateParams', '$http', '$element', '$mdDialog', '$mdToast', '$mdSidenav','$mdMedia','ZLCsService', "MedicalRecordPattern", "CsConst", 'Socket', 'PubSub',
        function($rootScope, $scope, $state, $filter, $timeout, $q, $stateParams, $http, $element, $mdDialog, $mdToast, $mdSidenav, $mdMedia, ZLCsService, MedicalRecordPattern, CsConst, Socket, PubSub) {
            var tagsChanged = undefined; //每次搜索的tags有变化时为true，变化后第一次发消息后设为false
            var pureTags = undefined;
            var pageSize;
            const MESSAGE_PAGE_SIZE = 30;
            // const CONV_PAGE_SIZE = 30;
            const CONV_PAGE_SIZE = 10;
            var firstConvQuery = true; // 是否第一次查询对话

            $scope.CASE_STATUS = CsConst.CASE.STATUS;

            const CHAT_CHANNEL = 'chat';  // 发 & 查询
            const ROOM_CHANNEL = 'room_message'; //收
            let ROLE_CHANNEL;    // 收
            const CONNECT_CHANNEL = 'user_connect';
            const JOIN_CHANNEL = 'join_rooms';

            var timeoutPromise;
            var delayInMs = 1000;

            //初始化2
            $scope.initAnswerChat = function() {
                initParams();

                Socket.on('connect', function() {
                    var host = window.location.host;
                    console.log('Socket is connected with ' + host + ', socket_id: ' + Socket.id);

                    $scope.$apply(function () {
                        $scope.socketId = Socket.id;
                    });

                    // 普通工作人员on connect， 将socket.id记录在user._id set下
                    PubSub.publish(CONNECT_CHANNEL,{type:'normal'});

                    // 加入所有replierId是该user._id的对话
                    PubSub.publish(JOIN_CHANNEL,{});
                });

                queryCurUser();

                //查询客服用户
                queryCrmUsers();

                $scope.selectedId = '';
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

            $scope.$on('$destroy', function(event) {
                PubSub.unSubscribeAll();
            });

            var queryCurUser = function() {
                $http.post('/cs/queryCurUser').then(function(result) {
                    if (result && result.data) {
                        $scope.user = result.data.content;
                        ROLE_CHANNEL = $scope.user.crm_role;
                        $scope.curReplyType = $scope.user.role.replyType;
                        // 启动监听
                        initPubsubListeners();
                        // 获取对话
                        $scope.getConversations();
                    } else {
                        $scope.user = undefined;
                    }
                });
            };


            var initPubsubListeners = function () {
                // 监听当前角色（replyType）的消息，对话未接入
                PubSub.subscribe(ROLE_CHANNEL, function (data) {
                    const {operation, payload} = data;
                    const option = (operation.method + '_' + operation.table).toUpperCase();
                    switch(option){
                        case 'POST_ONE_CONVERSATION':
                            $scope.$apply(function () {
                                $scope.convs.unshift(payload);
                            });
                            break;

                        case 'PUT_ONE_CONVERSATION':
                            if(operation.subMethod) {
                                switch (operation.subMethod.toUpperCase()) {
                                    case 'M_TO_1':
                                        var theConv = $filter('filter')($scope.convs, { _id: payload._id })[0];
                                        if (theConv) {
                                            var idx = $scope.convs.indexOf(theConv);
                                            $scope.$apply(function () {
                                                $scope.convs.splice(idx, 1);
                                            });
                                        }
                                        break;

                                    case '1_TO_M':
                                        $scope.$apply(function () {
                                            $scope.convs.unshift(payload);
                                        });
                                        break;

                                    case 'M_TO_M':
                                        if(payload.replyType === $scope.curReplyType) {
                                            $scope.$apply(function () {
                                                $scope.convs.unshift(payload);
                                            });
                                        }
                                        else{
                                            var theConv = $filter('filter')($scope.convs, { _id: payload._id })[0];
                                            if (theConv) {
                                                var idx = $scope.convs.indexOf(theConv);
                                                $scope.$apply(function () {
                                                    $scope.convs.splice(idx, 1);
                                                });
                                            }
                                        }
                                        break;
                                }
                            }
                            else{
                                var theConv = $filter('filter')($scope.convs, { _id: payload._id })[0];
                                if(theConv) {
                                    $scope.$apply(function () {
                                        angular.merge(theConv, payload);
                                    });
                                }
                                else{    //修改对话时，如果之前未获取就新增，因为修改的对话改变了updatedAt, 点击更多fetch不到
                                    $scope.$apply(function () {
                                        $scope.convs.unshift(payload);
                                    });
                                }
                            }
                            break;
                    }
                });

                // 监听已接入对话的聊天室消息
                PubSub.subscribe(ROOM_CHANNEL, function (data) {
                    const {operation, payload} = data;
                    const option = (operation.method + '_' + operation.table).toUpperCase();
                    switch(option){
                        case 'PUT_ONE_CONVERSATION':
                            if(operation.subMethod) {
                                switch (operation.subMethod.toUpperCase()) {
                                    case '1_TO_1':  // 1. 已接入的对话被指派给别人，2. 被指派新的对话
                                        if(payload.replierId === $scope.user._id) {
                                            var theConv = $filter('filter')($scope.convs, {_id: payload._id})[0];
                                            if (!theConv) {     // 防止将对话指派给当前replier
                                                $scope.$apply(function () {
                                                    $scope.convs.unshift(payload);
                                                });
                                            }
                                        }
                                        else{
                                            var theConv = $filter('filter')($scope.convs, {_id: payload._id})[0];
                                            if (theConv) {
                                                var idx = $scope.convs.indexOf(theConv);
                                                $scope.$apply(function () {
                                                    $scope.convs.splice(idx, 1);
                                                    if ($scope.curConv && theConv._id === $scope.curConv._id) { // 如果删除的是当前对话，将当前信息清空
                                                        clearCurConvData();
                                                    }
                                                });
                                            }
                                        }
                                        break;

                                    case 'M_TO_1':  // 接入，或者被指派
                                        $scope.$apply(function () {
                                            $scope.convs.unshift(payload);
                                        });
                                        break;

                                    case '1_TO_M':  // 结束对话，个人接听到排队
                                        var theConv = $filter('filter')($scope.convs, {_id: payload._id})[0];
                                        if (theConv) {
                                            var idx = $scope.convs.indexOf(theConv);
                                            $scope.$apply(function () {
                                                $scope.convs.splice(idx, 1);
                                                if ($scope.curConv && theConv._id === $scope.curConv._id) { // 如果删除的是当前对话，将当前信息清空
                                                    clearCurConvData();
                                                }
                                            });
                                        }
                                        break;
                                }
                            }
                            else{
                                var theConv = $filter('filter')($scope.convs, { _id: payload._id })[0];
                                if(theConv) {
                                    $scope.$apply(function () {
                                        angular.merge(theConv, payload);
                                    });
                                }
                                else{    //修改对话时，如果之前未获取就新增，因为修改的对话改变了updatedAt, 点击更多fetch不到
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
                            // var newMessages = [];
                            // for (var i = 0; i < payload.messages.length; i++) {
                            //     newMessages.push(payload.messages[i]);
                            // }
                            // $scope.$apply(function() {
                            //     $scope.curMessages = newMessages.concat($scope.curMessages);
                            //     $scope.loadMoreCtrl = (payload.count > MESSAGE_PAGE_SIZE * $scope.curMessagePage);
                            //     doScrollTop();
                            // });
                            $scope.$apply(function() {
                                $scope.curMessages = payload.messages.concat($scope.curMessages);
                                $scope.loadMoreCtrl = (payload.count > MESSAGE_PAGE_SIZE * $scope.curMessagePage);
                                doScrollTop();
                            });
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

            $scope.getConversations = function() {
                var options = {
                    condition: {
                        replyType: $scope.curReplyType,
                        replierId: $scope.user._id,
                        replying: true
                    },
                    paging: {
                        from: 'last',
                        page: 1,
                        pageSize: CONV_PAGE_SIZE
                    }
                };
                if ($scope.clientName)
                    options.condition.clientName = $scope.clientName;
                if ($scope.convs.length > 0) {
                    // 已经接入的对话的对最小 updatedAt
                    var repliedConvs = $filter('filter')($scope.convs, { replying: true }, true);
                    var minRepliedUpdatedAt = Math.min.apply(Math, repliedConvs.map(function(conv) { return conv.updatedAt; }));
                    options.condition.repliedUpdatedAt = minRepliedUpdatedAt;

                    // 尚未接入的对话的对最小 updatedAt
                    var nonRepliedConvs = $filter('filter')($scope.convs, { replying: false }, true);
                    var minNonRepliedUpdatedAt = Math.min.apply(Math, nonRepliedConvs.map(function(conv) { return conv.updatedAt; }));
                    options.condition.nonRepliedUpdatedAt = minNonRepliedUpdatedAt;
                }

                PubSub.publish(CHAT_CHANNEL, {
                    operation:{
                        method:'GET_MULTI',
                        table:'CONVERSATION'
                    },
                    payload:options
                });
            };

            $scope.getMessages = function() {
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

            $scope.getDriverStatus = function(n) {
                if (n !== undefined) {
                    //$filter
                    return $scope.ACTIVATION_STATUS[n];
                }
                return '';
            }

            $scope.$on('transfer.md', function(event, data) {

                $scope.medicalRecords = data.medicalRecords;
                $scope.menu = data.menu;
            });

            $scope.$on('newCaseFromMD', function(event, data) {
                $scope.queryCases();
            });

            $scope.$watch("clientName", function(newVal, oldValue) {
                if (newVal !== oldValue) {
                    $timeout.cancel(timeoutPromise);  //does nothing, if timeout alrdy done
                    timeoutPromise = $timeout(function(){   //Set timeout
                        $scope.convs = [];
                        $scope.clientId = '';
                        clearCurConvData();
                        $scope.getConversations();
                    },delayInMs);
                }
            }, true);


            var clearCurConvData = function() {
                $scope.curConv = undefined;
                $scope.curMessages = [];
                $scope.selectedId = '';
                $scope.clientId = '';
                $scope.loadMoreCtrl = false;
                //查询病历
                $rootScope.$broadcast('ZLCsApp.medicalRecordTemplateSource', {
                    source: 'answer_chat',
                    openid: '',
                });
            };

            $scope.refreshDicom = function () {
                $http.post('/cs/refreshDicom', {
                    openid: $scope.curConv.clientId
                }).then(function(result) {
                    if (result && result.data) {
                        angular.forEach(result.data.content,function (accsNumber) {
                            angular.forEach($scope.medicalRecords,function (medicalRecord) {
                                var studies = $filter('filter')(medicalRecord.dicomFiles.value, {accessionNumber: accsNumber });
                                if(!studies.length){
                                    // console.log(medicalRecord.patientName.value + " doesn't have: " + accsNumber);
                                    medicalRecord.dicomFiles.value.push({
                                        accessionNumber: accsNumber
                                    });
                                }
                            });
                        });

                    }
                });
            };

            $scope.uploadDicom = function () {
                var dicomUploadLink = "https://qtclinics.ambrahealth.com/api/v3/link/redirect?uuid=d1057ad7-1c77-46b4-b115-dff3f0c399ae&email_address=integrationuser@quantum.com&suppress_notification=1";
                window.open(dicomUploadLink, '_blank');
            };





            //查询客服角色
            var queryCrmUsers = function() {
                $http.post('/cs/findCrmUserMap').then(function(res) {
                    if (res && res.data) {
                        $scope.crmUserMap = res.data.content;
                        for (var i = 0; i < $scope.crmUserMap.length; i++) {
                            $scope.crmUserMap[i].users.unshift({    // 给每一个replyType增加一个排队选项
                                name: '排队',
                                userid: 'all'
                            })
                        }
                    } else {
                        $scope.crmUserMap = undefined;
                    }
                });
            };


            $scope.newTicket = function(c) {
                c.ticket = {
                    new: true
                };
                c.newTicketView = true;
            };
            $scope.cancelTicket = function(c) {
                c.newTicketView = false;
                c.ticket = {
                    new: false
                };

            }

            var playVoice = false;
            $scope.playAudio = function(url, e) {
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

                audio.addEventListener('ended', function() {
                    angular.element(".v_player_pause").removeClass("v_player");
                    playVoice = false;
                }, false);
            };


            $scope.saveTicket = function(ticket, id) {
                ticket.new = ticket.new || false;
                $http.post('/cs/case/saveAndUpdateTicket', {
                    case_id: id,
                    ticket: ticket
                }).then(function(result) {
                    $scope.queryCases();
                });
            };


            //选择用户对话
            $scope.joinChat = function(id) {
                if ($scope.selectedId === id)
                    return false;
                $scope.curConv = $filter('filter')($scope.convs, { _id: id })[0];
                $scope.selectedId = id;
                $scope.curMessages = [];

                $scope.clientId = $scope.curConv.clientId;
                if ($scope.clientId) {
                    //查询订单
                    $scope.querycase.openid = $scope.clientId;
                    //查询病历
                    $rootScope.$broadcast('ZLCsApp.medicalRecordTemplateSource', {
                        source: 'answer_chat',
                        openid: $scope.clientId,
                    });
                }

                $scope.curMessagePage = 0;
                $scope.loadMoreCtrl = false;
                $scope.getMessages();

                // 对话被当前工作人员锁定，其他工作人员不可见
                if (!$scope.curConv.replierId) {
                    replyConv($scope.curConv._id, $scope.user._id);
                }
            };

            var replyConv = function(conversationId, replierId) {
                var data = {
                    _id:conversationId,
                    replierId: replierId,
                };
                PubSub.publish(CHAT_CHANNEL, {
                    operation:{
                        method:'PUT_ONE',
                        subMethod:'M_TO_1',
                        table:'CONVERSATION'
                    },
                    payload:data
                });
            };

            //结束对话 && 没有答案结束对话
            $scope.endChat = function() {
                if(!$scope.curConv){
                    alert('请选择对话！');
                    return false;
                }
                var confirmEnd = $mdDialog.confirm()
                    .title('确定要结束会话？')
                    .ariaLabel('del')
                    .ok('确定')
                    .cancel('取消');
                $mdDialog.show(confirmEnd).then(function() {
                    var data = {
                        _id:$scope.curConv._id,
                        replyType: 310,
                    };
                    PubSub.publish(CHAT_CHANNEL, {
                        operation:{
                            method:'PUT_ONE',
                            subMethod:'1_TO_M',
                            table:'CONVERSATION'
                        },
                        payload:data
                    });
                    $rootScope.$broadcast('ZLCsApp.medicalRecordTemplateSource', {
                        source: 'answer_chat_from_case_medical_record',
                        medical_record_id: ""
                    });
                }, function() {

                });
            };

            var caseEditable = function(editable) {
                $scope.caseStyle = editable ? {} : { 'pointer-events': 'none', 'color': 'lightgray' };
                $scope.showSubmit = editable;
            };

            var lastestQuestion = function(messages) {
                for (var i = messages.length - 1; i >= 0; i--) {
                    if (messages[i].senderId != $scope.user._id) {
                        return messages[i].text;
                    }
                }
                return '';
            };

            //重写froalaEditor的Ctrl + Enter or ⌘ Cmd + Enter快捷键响应
            $('.msg_content').on('froalaEditor.initialized', function(e, editor) {
                editor.events.on('keydown', function(keydownEvent) {
                    //Ctrl + Enter or ⌘ Cmd + Enter
                    if (keydownEvent.keyCode === 13 && (keydownEvent.ctrlKey || keydownEvent.metaKey)) {
                        $scope.sendMsg(true);
                        e.preventDefault();
                        e.stopPropagation();
                        keydownEvent.preventDefault();
                        keydownEvent.stopPropagation();
                        return false;
                    }
                }, true)
            });

            //发送消息
            $scope.sendMsg = function(apply) {
                //快捷键发送需要手动apply 否则会延迟很多，未找到原因，
                if (apply) {
                    $scope.safeApply(function() {
                        sendMessage();
                    });
                } else {
                    sendMessage();
                }
            };


            $scope.delHtmlTag = function(text) {
                return ZLCsService.delHtmlTag(text);
            };

            $scope.setOption = function(option) {
                $scope.option = option;
            };

            $scope.setMsgContent = function(content) {
                $scope.msg_content = content;
            };

            $scope.safeApply = function(fn) {
                var phase = this.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && (typeof(fn) === 'function')) {
                        fn();
                    }
                } else {
                    this.$apply(fn);
                }
            };

            $scope.setFold = function(folding) {
                $scope.fold = folding;
                if (folding) {
                    $('.qas_layer').width('47%');
                } else {
                    $('.qas_layer').width('27%');
                }
            };


            var sendMessage = function() {
                if(!$scope.curConv){
                    alert('请选择对话！');
                    return false;
                }
                //通过froalaEditor的api取值，angular取值需要等view刷新完，有延迟
                //var html = $('.msg_content').val() ||  $('.msg_content').froalaEditor('html.get');
                // var html = $scope.msg_content;
                var html = $('.msg_content').val();

                //去html标签和空格后，判断输入内容是否为空
                var text = ZLCsService.delHtmlTag(html);
                var pureText = (text && text != "") ? text.replace(/(^\s*)|(\s*$)/g, "") : "";
                if (pureText.trim() != "" || html.match(new RegExp("<img.+?src=[\"'](.+?)[\"'].*?>", 'ig'))) {
                    pushMessage(html);
                }

                //$('.msg_content').froalaEditor('html.set', '');
                $timeout(function () {
                    $scope.msg_content = '';
                }, 300);
            };



            var pushMessage = function(html) {
                var data = {
                    content: html,
                    msgType: 'text',
                    clientId: $scope.clientId,
                    fromUserId: $scope.user._id,
                    fromUserName: $scope.user.nickname || $scope.user.name,
                    createdAt: (new Date()).getTime(),
                };

                //PubSub.publish(options, data);
                PubSub.publish(CHAT_CHANNEL, {
                    operation:{
                        method:'POST_ONE',
                        table:'MESSAGE'
                    },
                    payload:data
                });
            };

            $scope.contactClient = function(idx) {
                var clientId = $scope.cases.rows[idx].openid;
                if(!clientId){
                    alert("该订单未绑定微信用户");
                    return false;
                }
                PubSub.get("GET_ONE_CONVERSATION", {
                    operation:{
                        method:'GET_MULTI',
                        table:'CONVERSATION'
                    },
                    payload:{
                        clientId
                    }
                },function (data) {
                    if(data && data.payload){
                        var conv = data.payload;
                        if(conv.replyType === 230){
                            alert("该用户目前处于人工对话中");
                            return false;
                        }
                        else{

                            var data = {
                                _id:conv._id,
                                replyType:230,
                                replierId:$scope.user._id,
                            };
                            PubSub.publish(CHAT_CHANNEL, {
                                operation:{
                                    method:'PUT_ONE',
                                    subMethod:'M_TO_1',
                                    table:'CONVERSATION',
                                },
                                payload:data
                            });
                        }
                    }
                    else{
                        alert("该订单未绑定微信用户");
                        return false;
                    }
                });
                // var replyType = CsConst.CONVER.ROLE_REPLY_MAP[$scope.user.crm_role];
                // PubSub.autoConvToManual(clientId, $scope.user._id, replyType, function(res) {
                //     if (res === 'notavail') {
                //         alert('该用户目前处于人工对话中');
                //     }
                // });
            };


            $scope.convertContent = function(content) {
                return content ? content.replace("\\n", "</br>") : ''
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
                        if (hl_content && hl_content.length > 40) {
                            hl_content = hl_content.substring(0, 40) + "..."
                        }
                        var content = "<a target='_blank' href='" + article.url + "'>" + hits[i]._source.title + "</a>" + (hl_content || "");
                        contents.push(content);
                    }
                }
                return contents.join("</br>");
            };


            //滚动滚动条到底部
            var qa_query_time = true;
            var doScrollTop = function() {
                //在view更新后，获取消息显示的高度，将滚动条滚动到底部
                setTimeout(function() {
                    var height = $(".messages ul").height();
                    $(".messages").scrollTop(height)
                }, 300);
            };


            $scope.convFilter = function(conv) {
                return !conv.replierId || conv.replierId === $scope.user._id;
            };

            $scope.showConvTitle = function(conv) {
                var messageStatus = (conv.lastUserId === conv.clientId && conv.replierId) ? '（新消息）' : (!conv.replierId) ? '（排队）' : '';
                return (conv.clientName || conv.fromUserName) + messageStatus;
            };

            $scope.replierExists = function(conv) {
                return !conv.replierId;
            };

            $scope.newQuestion = function(conv) {
                return !(conv.clientId === conv.lastUserId);
            }

            $scope.moveToOtherUser = function(role, uid, uname) {
                if(!$scope.curConv){
                    alert('请选择对话！');
                    return false;
                }
                var replyType = CsConst.CONVER.ROLE_REPLY_MAP[role];
                if (uid === 'all') { // 排队
                    transferConv($scope.curConv._id, replyType);
                } else { //指派个人
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
                PubSub.publish(CHAT_CHANNEL, {
                    operation:{
                        method:'PUT_ONE',
                        subMethod:(replierId ? '1_TO_1' : '1_TO_M'),
                        table:'CONVERSATION',
                    },
                    payload:data
                });
            };


            // 用已有问题测试时，在工作人员端将对话转移到completedConv，使用客户端后在客户端将对话转移到completedConv
            var moveToAutomaticReply = function() {
                var newConv = angular.copy($scope.curConv);
                delete newConv.id;
                delete newConv.$priority;

                var newConvRef = convRef.push(newConv);
                // convToConvRef.child($scope.curConv.id).set(newCompletedConvRef.key());      //建立conv转移前后的查询

                $scope.convs.$remove($scope.curConv);
                $scope.curConv = undefined;
            };

            //结束对话前验证
            function validate() {
                var arr = $filter("filter")($scope.curMessages, {
                    fromUserId: $scope.user._id,
                });
                if (arr.length < 1) {
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
                toolbarButtons: [],
                toolbarButtonsMD: [],
                toolbarButtonsSM: [],
                // toolbarButtons : ['insertImage','insertLink'],
                // toolbarButtonsMD : ['insertImage','insertLink'],
                // toolbarButtonsSM : ['insertImage','insertLink'],
                heightMax: 200,
                height: 200
            };

            $scope.querycase = {
                casePageSize: 3,
                casePage: 1
            };
            $scope.queryCases = function() {
                var cond = {
                    page: $scope.querycase.casePage || 1,
                    pageSize: $scope.querycase.casePageSize
                };
                if ($scope.querycase.openid) {
                    if ($scope.querycase.openid != "all") {
                        cond.openid = $scope.querycase.openid;
                    }
                }
                if ($scope.querycase.order_id) {
                    cond.order_id = $scope.querycase.order_id;
                }
                $http.post('/cs/case/queryCases', {
                    cond: cond
                }).then(function(res) {

                    if (res && res.data) {
                        $scope.cases = res.data.content;
                    } else {
                        $scope.cases = undefined;
                    }
                });
            };

            $scope.loadCurMr = function(id) {
                $rootScope.$broadcast('ZLCsApp.medicalRecordTemplateSource', {
                    source: 'answer_chat_from_case_medical_record',
                    medical_record_id: id
                });
            };

            $scope.showLogs = function(c) {
                c.logshow = c.logshow ? false : true;
            };


            $scope.showTickets = function(c) {
                c.ticketshow = c.ticketshow ? false : true;
            };

            $scope.editTicket = function(t, c) {
                c.newTicketView = true;
                c.ticket = t;
            };

            $scope.statusName = function(status) { return CsConst.CASE.STATUS_MAP[status]};

            $scope.confirmCase = function(id) {
                changeCaseStatus(id, CsConst.CASE.STATUS.TO_PAY);
            };

            $scope.cancelCase = function(id) {
                changeCaseStatus(id, CsConst.CASE.STATUS.CANCELLED);
            };

            $scope.canConfirm = function(status) {
                return status === CsConst.CASE.STATUS.TO_CONFIRM || status === CsConst.CASE.STATUS.CANCELLED;
            };

            $scope.canCancel = function(status) {
                return status !== CsConst.CASE.STATUS.CANCELLED;
            };

            var changeCaseStatus = function(id, status) {
                $http.post('/cs/case/changeCaseStatus', {
                    case_id: id,
                    status: status
                }).then(function(res) {
                    if (res && res.data) {
                        $scope.queryCases();
                    }


                    //更新订单日志
                    // var log = {};
                    // if (status == CsConst.CASE.STATUS.TO_PAY) log.title = "确认了订单";
                    // if (status == CsConst.CASE.STATUS.CANCELLED) log.title = "取消了订单";
                    //
                    // ZLCsService.pushLogWithCase($scope.cases.rows[idx]._id, log, function() {
                    //     ZLCsService.refreshLogs($scope.cases.rows[idx]._id, function(logs) {
                    //         //刷新订单日志
                    //         $scope.cases.rows[idx].logs = logs;
                    //     });
                    // });

                });
            };

            $scope.isImage = function (fileName) {
                var ext = fileName.split('.').pop().toUpperCase();
                return ['JPG','JPEG','PNG'].indexOf(ext) !== -1;
            };

            $scope.$watchGroup(['querycase', 'querycase.openid', 'querycase.order_id', 'querycase.casePage'], function(newVal, oldVal) {
                if (newVal[0]) {
                    $scope.queryCases();
                }
            });


            $scope.toggle = function(item, list) {
                var idx = list.indexOf(item);
                if (idx > -1) {
                    list.splice(idx, 1);
                } else {
                    list.push(item);
                }
            };

            $scope.exists = function(item, list) { list.indexOf(item) > -1 };

            $scope.opened = {};

            $scope.open = function($event, elementOpened) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened[elementOpened] = !$scope.opened[elementOpened];
            };


            $scope.openModalImage = function(imageSrc) {
                ZLCsService.openModalImage(imageSrc);
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
                        url: file.url,
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
            $scope.getQaContent = function(id, type) {
                if (id) {
                    $http.get('/cs/qa/getOneQa?id='+id).then(function(response, status, headers) {

                        if (response && response.data && response.data.hits && response.data.hits[0]) {
                            var qa = response.data.hits[0]._source;
                            var _id = response.data.hits[0]._id;
                            var msg_content = "";
                            switch (type) {
                                case "text":
                                    msg_content = qa.content;
                                    break;
                                case "link":
                                    var url = qa.url;
                                    if (!url) {
                                        var redirectUrl = "https://v1.zlzhidao.com/qab/#/question_info?id=" + _id.toString() + "&title_id=" + qa.title_id.toString()
                                        url = "https://v1.zlzhidao.com/qab/redirect?auth_after_url=" + encodeURIComponent(redirectUrl)
                                    }
                                    msg_content = "<a href='" + url + "'>" + qa.title + "</a></br>" + (qa.digest || "");
                                    msg_content += "...";

                                    break;
                            }
                            if (qa.source || qa.translate_name || (qa.checkUsers && qa.checkUsers.length > 0)) {
                                msg_content += "</br>";
                                if (qa.source) {
                                    msg_content += "来源：" + qa.source + ";";
                                }
                                if (qa.translate_name) {
                                    msg_content += "翻译：" + qa.translate_name + ";";
                                }
                                if (qa.checkUsers && qa.checkUsers.length > 0) {
                                    var username = qa.checkUsers.map(function(u) {
                                        return u.checkerName
                                    });
                                    msg_content += "其他贡献者：" + username.toString() + ";";
                                }
                            }


                            $scope.msg_content = msg_content;
                        }
                    });
                }
            };


            $scope.CM = {
                initParams: function() {
                    $scope.commonCategoryOnShow = {};
                    $scope.CM.getCommonExpression();
                },

                getCommonExpression: function() {
                    $http.post('/cs/commonExp/getCommonExpressions').then(function(result) {
                        if (result && result.data) {
                            $scope.commons = result.data.content;
                        } else {
                            $scope.commons = {};
                        }
                        $scope.CM.loadNewCommons();
                        $scope.CM.watchCommonChange();
                    });
                },

                setCommonExpression: function() {
                    $http.post('/cs/commonExp/setCommonExpressions', {
                        cm: $scope.commons
                    }).then(function(result) {
                        if (result && result.data) {

                        }
                    });
                },

                loadNewCommons: function() {
                    $scope.newCommon = {};
                    for (var key in $scope.commons) {
                        if ($scope.commons.hasOwnProperty(key)) {
                            $scope.newCommon[key] = '';
                        }
                    }
                },

                watchCommonChange: function() {
                    $scope.$watch("commons", function(newValue, oldValue) {
                        if (newValue === oldValue) {
                            return;
                        }
                        $scope.CM.setCommonExpression();
                    }, true);
                },

                showHideCommonCategory: function(key) {
                    $scope.commonCategoryOnShow[key] = $scope.commonCategoryOnShow[key] ? (!$scope.commonCategoryOnShow[key]) : true;
                },

                submitNewCommon: function(key) {
                    if ($scope.newCommon[key]) {
                        $scope.commons[key].push($scope.newCommon[key]);
                        $scope.newCommon[key] = '';
                    }
                },

                deleteCommon: function(key, index) {
                    $scope.commons[key].splice(index, 1);
                },

                newCommonCategory: function() {
                    if ($scope.newCategory) {
                        if ($scope.commons[$scope.newCategory]) {
                            alert('该分类已存在');
                            return false;
                        }
                        $scope.commons[$scope.newCategory] = [];
                        $scope.newCommon[$scope.newCategory] = '';
                        $scope.commonCategoryOnShow[$scope.newCategory] = true;
                        $scope.newCategory = '';
                    }
                },

                deleteCategory: function(key) {
                    delete $scope.commons[key];
                },
            };


            var initParams = function() {
                $scope.input = {};
                $scope.convs = [];
                $scope.selectedId = '';     // 已经选择对话的Id
                $scope.curMessages = [];
                $scope.curConvType = '人工回复';
                $scope.loadMoreCtrl = false;
                $scope.loadMoreConvCtrl = false;


                $scope.option = 'search';
                //用户的模糊查询
                $scope.searchText = "";
                $scope.CM.initParams();

                $scope.roleNameMap = {
                    'qt_cs':'量子客服'
                }
            };


        }
    ]);