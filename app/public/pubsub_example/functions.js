/**
 * Created by Yang1 on 8/10/17.
 */

const admin = {
    id: '582562fba4b24ff2038e6978',
    name: '肿瘤知道小助手'
};
const manualReplyType = 310;

var GET_SOCKET_FUNCTION = function () {
    var host = window.location.host;
    var socket;
    if(!socket) {
        socket = io.connect("https://" + document.domain + ":3939");
        socket.on('connect', function () {
            console.log('Socket is connected with ' + host);
        });
    }
    return socket;
};

var PUB_SUB_FUNCTION = function(Socket){
    var messageContainer =  [];
    return {
        subscribe: function(options, callback){
            if(typeof(options) === 'object'){
                var method = options.method.toUpperCase();
                var tableName = options.tableName;
                var modelId = options.modelId;
                var condition = options.condition;
                var paging = options.paging;

                var event_main = '', event_condition = '', event_paging = '';
                condition && (event_condition = JSON.stringify(condition, Object.keys(condition).sort()));
                paging && (event_paging = JSON.stringify(paging, Object.keys(paging).sort()));
                switch(method){
                    case 'GET':
                        if(modelId) {     // get/conversations/some_id
                            event_main = method + '/' + tableName + '/' + modelId;
                        }
                        else {           // get/messages|_|{"clientId":xxx}|_|{"from":"first","page":2,"pageSize":30}  , from包括 first 和 last
                            event_main = method + '/' + tableName;
                        }
                        break;

                    case 'POST':     // post/conversations     ， 新的data
                        event_main = method + '/' + tableName;
                        break;

                    case 'PUT':     // put/conversations/some_id    data改变
                        event_main = method + '/' + tableName + '/' + modelId;
                        break;

                    case 'DELETE':    // delete/conversations/some_id
                        event_main = method + '/' + tableName + '/' + modelId;
                        break;
                }
                var event_name = event_main + '|_|' + event_condition + '|_|' + event_paging;
                // publish
                if(method.toUpperCase() === 'GET' || method.toUpperCase() === 'DELETE') {
                    Socket.once(event_name, callback);      //  触发一次
                }
                else{
                    Socket.on(event_name, callback);        // 一直出发
                }

                if(tableName === 'messages' && method.toUpperCase() === 'POST'){
                    this.pushMessageContainer(event_name);
                }
            }else{
                throw 'Error: Option must be an object';
            }
        },

        publish: function(options, data){
            if(typeof(options) === 'object'){
                var method = options.method.toUpperCase();
                var tableName = options.tableName;
                var modelId = options.modelId;
                var condition = options.condition;
                var paging = options.paging;

                var event_main= '', event_condition = '', event_paging = '';
                condition && (event_condition = JSON.stringify(condition, Object.keys(condition).sort()));
                paging && (event_paging = JSON.stringify(paging, Object.keys(paging).sort()));
                switch(method){
                    case 'GET':
                        if(modelId) {     // get/conversations/some_id
                            event_main = method + '/' + tableName + '/' + modelId;
                        }
                        else {           // get/conversations|_|{"replyType":230}|_|{"from":"first","page":2,"pageSize":30}  , from包括 first 和 last
                            event_main = method + '/' + tableName;
                        }
                        break;

                    case 'POST':     // post/messages
                        event_main = method + '/' + tableName;
                        break;

                    case 'PUT':     // put/conversations/some_id
                        event_main = method + '/' + tableName + '/' + modelId;
                        break;

                    case 'DELETE':    // delete/conversations/some_id
                        event_main = method + '/' + tableName + '/' + modelId;
                        break;
                }
                var event_name = event_main + '|_|' + event_condition + '|_|' + event_paging;
                // publish
                Socket.emit(event_name, data);

            }else{
                throw 'Error: Option must be an object';
            }
        },

        get:function(options, callback){
            if(typeof(options) === 'object'){
                var method = options.method.toUpperCase();
                if(method === 'GET'){
                    this.subscribe(options, callback);
                    this.publish(options);
                }
                else{
                    throw 'Error: method must be get';
                }

            }else{
                throw 'Error: Option must be an object';
            }
        },

        manualConvToAuto:function (clientId) {

            var options = {
                tableName: 'messages',
                method: 'POST'
            };

            var data = {
                content:"人工顾问已经断开，感谢您的使用，重新联系顾问，请输入'呼叫人工'",
                msgType:'text',
                replyType:manualReplyType,
                clientId:clientId,
                fromUserId:admin.id,
                fromUserName:admin.name,
                createdAt:(new Date()).getTime(),
            };

            this.publish(options,data);
            this.replyConv(clientId,'');
        },

        replyConv: function (modelId, replierId) {
            var options ={
                tableName: 'conversations',
                method: 'PUT',
                modelId:modelId
            };

            var data = {
                replierId:replierId,
            };
            this.publish(options,data);
        },

        pushMessageContainer : function(subscriptionName){
            messageContainer.push(subscriptionName);
        },

        unSubscribeAll: function(){
            Socket.removeAllListeners();
            // for(var i=0; i<container.length; i++){
            //     Socket.removeAllListeners(container[i]);
            // }
            //Now reset the container..
            container = [];
        },

        unSubscribeMessage:function () {
            for(var i=0; i<messageContainer.length; i++){
                Socket.removeListener(messageContainer[i]);
            }
        },

        getAllListeners:function () {
            var listeners = Socket.eventNames();
            console.log('listeners: ' + listeners);
        },
    };
};