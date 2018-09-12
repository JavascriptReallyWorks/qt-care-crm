
module.exports = app => {
    app.io.of('/wechat').route('chat', app.io.controller.chatController.chat);
    app.io.of('/wechat').route('user_connect', app.io.controller.chatController.userConnect);
    app.io.of('/wechat').route('join_rooms', app.io.controller.chatController.joinRooms);
    app.io.of('/wechat').route('GET_ONE_CONVERSATION', app.io.controller.chatController.GET_ONE_CONVERSATION);
};