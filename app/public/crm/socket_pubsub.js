/**
 * Created by Yang1 on 8/10/17.
 */

const admin = {
    id: '582562fba4b24ff2038e6978',
    name: '肿瘤知道小助手'
};
const autoReplyType = 310;
const manualReplyType = 230;

import io from 'socket.io-client'

exports.GET_SOCKET_FUNCTION = function() {
    var host = window.location.host;
    var socket;
    if (!socket) {
        socket = io.connect("https://" + window.location.host + "/wechat");
    }
    return socket;
};

exports.PUB_SUB_FUNCTION = function(Socket) {
    var messageContainer = [];
    var convContainer = [];
    return {

        subscribe: function(event, callback) {
            Socket.on(event, function (data) {
                callback(data);
            });
        },

        publish: function (event, payload) {
            Socket.emit(event, payload);
        },

        get:function (event,payload,callback) {
            Socket.once(event, function (data) {
                callback(data);
            });
            Socket.emit(event, payload);
        },
        unsubscribe: function(options) {
            //Socket.removeListener(event_name);
        },

        unSubscribeAll: function() {
            Socket.removeAllListeners();
            // container = [];
        },

        unSubscribeMessage: function() {
            for (var i = 0; i < messageContainer.length; i++) {
                Socket.removeListener(messageContainer[i]);
            }
        },

        unSubscribeConversation: function() {
            for (var i = 0; i < convContainer.length; i++) {
                Socket.removeListener(convContainer[i]);
            }
        },
    };
};