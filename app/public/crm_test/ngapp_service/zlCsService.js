/**
 * Created by Yang1 on 6/29/17.
 */
var app = angular.module("ZLCsApp");

app.service("ZLCsService", function ($mdDialog,$q,$http,$uibModal,CsConst) {

        var QT_CS_USERS;

        this.randomString = function (len) {
            len = len || 32;
            var CHARS = 'ABCDEFGHJKMNPQRSTWXYZ2345678';
            var maxPos = CHARS.length;
            var str = '';
            for (var i = 0; i < len; i++) {
                str += CHARS.charAt(Math.floor(Math.random() * maxPos));
            }
            return str;
        };

        this.randomLowercaseString = function (len) {
            len = len || 32;
            var CHARS = 'abcdefghjkmnpqrstwxyz2345678';
            var maxPos = CHARS.length;
            var str = '';
            for (var i = 0; i < len; i++) {
                str += CHARS.charAt(Math.floor(Math.random() * maxPos));
            }
            return str;
        };

        this.uqArray = function (arr) {
            if (arr && Array.isArray(arr)) {
                var uq = {};
                var re = [];
                for (var i = 0; i < arr.length; i++) {
                    if (!uq[arr[i]] && arr[i] && arr[i] != "") {
                        uq[arr[i]] = true;
                        re.push(arr[i]);
                    }
                }
                return re;
            }
            return arr;
        };
        this.removeArrayExists = function (arr, exists_arr) {
            if (arr && exists_arr) {
                for (var i = 0; i < exists_arr.length; i++) {
                    var index = arr.indexOf(exists_arr[i]);
                    if (index != -1) {
                        arr.splice(index, 1);
                    }
                }
                return arr;
            }

        };
        this.delHtmlTag = function (str) {
            if (str) {
                var str = str.replace(/<\/?[^>]*>/gim, "");//去掉所有的html标记
                // var result = str.replace(/(^\s+)|(\s+$)/g, "")//去掉前后空格
                // result =  result.replace(/[ 　]+(?=[\u4e00-\u9fa5])/g,"");//去除文章中间空格
                // return result.replace(/[\r\n]/g, "");
                return str
            } else {
                return str;
            }

        };

        this.openModalImage = function (imageSrc) {
            $uibModal.open({
                templateUrl: "/cs/cs_partials/modalImage",
                resolve: {
                    imageSrcToUse: function () {
                        return imageSrc;

                    },
                },
                controller: [
                    "$scope", "imageSrcToUse",
                    function ($scope, imageSrcToUse) {
                        $scope.ImageSrc = imageSrcToUse;
                    }
                ]
            });
        };


        this.pushLogWithCase = function (id, log, callback) {
            $http.post('/auth/manager/cs/case/pushLogWithCase', {
                case_id: id,
                log: log
            }).then(function (result) {
                callback();
            });
        };
        this.refreshLogs = function (id, callback) {
            $http.post('/cs/case/queryLogByCase', {
                id: id
            }).then(function (result) {
                if (result && result.data) {
                    callback(result.data.content.logs)
                }
            });
        };

        this.notify = function (title, content) {

            if (!title && !content) {
                title = "桌面提醒";
                content = "您看到此条信息桌面提醒设置成功";
            }
            var iconUrl = "/img/icons/condition-title.png";

            if (window.webkitNotifications) {
                //chrome老版本
                if (window.webkitNotifications.checkPermission() == 0) {
                    var notif = window.webkitNotifications.createNotification(iconUrl, title, content);
                    notif.display = function () {
                    }
                    notif.onerror = function () {
                    }
                    notif.onclose = function () {
                    }
                    notif.onclick = function () {
                        this.cancel();
                    }
                    notif.replaceId = 'Meteoric';
                    notif.show();
                } else {
                    window.webkitNotifications.requestPermission($jy.notify);
                }
            }
            else if ("Notification" in window) {
                // 判断是否有权限
                if (Notification.permission === "granted") {
                    var notification = new Notification(title, {
                        "icon": iconUrl,
                        "body": content,
                    });
                }
                //如果没权限，则请求权限
                else if (Notification.permission !== 'denied') {
                    Notification.requestPermission(function (permission) {
                        // Whatever the user answers, we make sure we store the
                        // information
                        if (!('permission' in Notification)) {
                            Notification.permission = permission;
                        }
                        //如果接受请求
                        if (permission === "granted") {
                            var notification = new Notification(title, {
                                "icon": iconUrl,
                                "body": content,
                            });
                        }
                    });
                }
            }
        };

        this.queryDoctor = function ($query, page, pageSize) {
            return $http.post('/auth/manager/doctor/queryDoctorByCond', {
                cond: {
                    doctor_name: $query
                },
                page: page,
                limit: pageSize
            }).then(function (response) {
                return response.data.rows.map(function (item) {
                    return item;
                });
            });
        };
        this.queryOneDoctor = function (id, callback) {
            if (id) {
                $http({
                    method: 'get',
                    url: '/auth/manager/doctor/findOneDoctor?id=' + id,
                }).then(function successCallback(res) {
                    callback(res.data)
                }, function errorCallback(res) {
                    callback(null)
                });
            } else {
                callback(null)
            }

        };

        this.getSubTags = function (select_tag) {
            var url = '/auth/manager/tags/getSubTags?1=1';
            if (select_tag) {
                url += "&r_tag=" + $scope.select_tags.join(",");
            }
        };

        this.qtCsUsers = function (cb) {
            if(QT_CS_USERS){
                cb(QT_CS_USERS);
            }
            else{
                $http.get('/cs/qtCsUsers').then(function (result) {
                    if(result.data && result.data.status === 'ok'){
                        QT_CS_USERS = result.data.content;
                        cb(QT_CS_USERS);
                    }
                });
            }
        };

        this.removeLeadingHttp  = function (str) {
            // 除去有可能的 "http://" or "https://"
            return str.replace(/^https?\:\/\//i, "");
        };
});