/**
 *  以下内容多摘自官方demo
 *
 **/
$(function () {
    var pageTitle = $("title").text();
    var desc = $("desc").text();
    console.log(desc);

    wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: appId, // 必填，公众号的唯一标识
        timestamp: timestamp, // 必填，生成签名的时间戳
        nonceStr: nonceStr, // 必填，生成签名的随机串
        signature: signature,// 必填，签名，见附录1
        jsApiList: ['checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'closeWindow'
        ] // 必填，需要使用的JS接口列表，
    });

    wx.ready(function(){
        // 1 判断当前版本是否支持指定 JS 接口，支持批量判断
        wx.checkJsApi({
            jsApiList: [
                'getNetworkType',
                'previewImage'
            ],
            success: function (res) {
            }
        });


        // 2. 分享接口
        // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareAppMessage({
            title: pageTitle,
            desc: desc,
            link: location.href,
            imgUrl: 'https://mmbiz.qlogo.cn/mmbiz/7LxyGIeCu16diboWm4qjQ8GPibdjyBNgZF3SDicQhAd2U11WUE06mlP8UA2161myqJmkNxqSkH3VLwjWOiciagibEfrw/0?wx_fmt=jpeg',
            trigger: function (res) {
                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                //alert('用户点击发送给朋友');
            },
            success: function (res) {
            },
            cancel: function (res) {
                //alert('已取消');
            },
            fail: function (res) {
            }
        });
    });

    wx.error(function(res){
        JSON.stringify(res)
    });
});
