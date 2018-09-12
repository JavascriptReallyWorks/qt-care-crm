
angular.module('SingleChat',[
    'ui.router',
    'ZLSysApp.unsafe-filter',
    'ngMaterial',
    "ui.bootstrap"
])
    .controller('SingleChatCtrl', ['$scope', '$state', '$filter', '$stateParams', '$http',
        function ($scope, $state, $filter, $stateParams, $http) {

            var Socket;
            var host = window.location.host;
            var timestamp = (new Date().getTime()).toString().substr(-4);
            // var articleId = '5aed7ef6660d42003fd23c54';
            var articleId = '5b05350b4e5560003a7d0085';
            var curriculaId =  '5aed76e1660d42003fd23c4b';
            // var TEST_OPEN_ID = 'TEST_OPEN_ID' + (new Date().getTime()).toString();
            // var TEST_USER_NAME = 'TEST_OPEN_ID' + timestamp
            var TEST_OPEN_ID = 'TEST_OPEN_ID1526600059446';
            var TEST_USER_NAME = '李四9446';


            $scope.initSingleChatCtrl = function () {
                $scope.input = {};
                $scope.messages = [];
                queryCurUser();
                // testGetOpenId();
                // testEggRest();
                testDoctorLogin();
            };

            var testDoctorLogin = function () {
                $http.post('/doctor_login',{
                    username:'cat@ucsf.edu',
                    password:'123321'
                }).then(function (res) {
                    if (res && res.data) {
                        console.log(res.data);
                        $scope.token = res.data.content.token;
                        testEggRest();
                    }
                });
            }

            var testEggRest = function () {
                $http.defaults.headers.common['Authorization'] =  $scope.token;
                $http.get('/doc/api/cases?per_page=10&page=1').then(function (res) {
                    if (res && res.data) {
                        console.log(res.data);
                    }
                });
            }

            var testGetOpenId = function () {
                $http.post('/miniprogram/api/fetch_open_id',{
                    code:'',
                    userInfo:{},
                }).then(function (res) {
                    if (res && res.data) {
                        console.log(res.data);
                    }
                });
            }

            var initSocket = function () {
                var host = window.location.host;
                if (!Socket) {
                    var url = "https://" + window.location.host + "/wechat?openid=" + $scope.user.openid +  "&user_name=" + $scope.user.nickname || $scope.user.name + "&user_type=XCX"
                    // var url = "https://" + window.location.host + "/wechat?openid=" + TEST_OPEN_ID +  "&user_name=" + TEST_USER_NAME + "&user_type=XCX"

                    /*
                    Socket = io(url,{
                        query:{
                            openid: $scope.user.openid,
                            user_name: $scope.user.nickname || $scope.user.name,
                            user_type: 'XCX'
                        }
                    });
                    */
                    Socket = io(url);
                    Socket.on('reconnect', function() {
                        console.log('Socket is reconnected with ' + host + ', socket_id: ' + Socket.id);
                    });

                    Socket.on('connect', function() {
                        console.log('Socket is connected with ' + host + ', socket_id: ' + Socket.id);


                        Socket.emit('offline_message',{
                            openid:$scope.user.openid
                        });
                        Socket.emit('conv_status',{
                            openid:$scope.user.openid
                        });

                        Socket.emit('get_messages',{
                            openid:$scope.user.openid,
                            createdAt: new Date(),
                            limit:5,

                        },function (data) {
                            $scope.$apply(function () {
                                $scope.messages = data.messages.reverse();
                            });
                        });

                        Socket.emit('get_messages',{
                            openid:$scope.user.openid,
                            createdAt: new Date(),
                            limit:5,

                        },function (data) {
                            $scope.$apply(function () {
                                $scope.messages = data.messages.reverse();
                            });
                        });

                        getCurPatient();

                    });
                }

                // 监听已接入对话的聊天室消息
                Socket.on('room_message', function (data) {
                    const {operation, payload} = data;
                    const option = (operation.method + '_' + operation.table).toUpperCase();
                    switch(option){
                        case 'POST_ONE_MESSAGE':
                            $scope.$apply(function() {
                                $scope.messages.push(payload);
                            });
                            break;
                    }
                });

                Socket.on('offline_message', function (payload) {
                    $scope.$apply(function () {
                        angular.forEach(payload.data, function (message) {
                            $scope.messages.push(message);
                        })
                    });
                });

                Socket.on('conv_status', function (payload) {
                    $scope.status = payload.status;     // "auto" or "manual"
                });
            };

            $scope.send = function (text) {
                var data = {
                    content: text || $scope.input.message,
                    // operation:'manual',
                    msgType: 'text',
                    fid:'fid_' + Date.now(),
                    interType: text ? 'click':'type',
                    clientId: $scope.user.openid,
                    fromUserId: $scope.user.openid,
                    fromUserName: $scope.user.nickname || $scope.user.name,
                    createdAt: (new Date()).getTime(),
                };

                Socket.emit('chat', {
                    operation:{
                        method:'POST_ONE',
                        table:'MESSAGE'
                    },
                    payload:data
                });
                $scope.input.message = '';
            };

            $scope.getArticle = function () {
                Socket.emit('get_article',{
                    url:encodeURI('https://stg-cms.zlzhidao.com/public_api/curricula/article/get?tags=第一期')
                },function (data) {
                    console.log('get article response: ' + JSON.stringify(data));
                });
            };

            $scope.queryTitles = function () {
                var payload = {
                    title:$scope.input.title,
                    limit:5
                };
                var callback = function (data) {
                    console.log(data);
                }
                Socket.emit('query_titles', payload, callback);
            };

            $scope.newStar = function () {
                var callback = function (data) {
                    console.log(data);
                }
                var payload = {
                    tag:'5aeae0b936fcc00126c67ff0' + Date.now(),
                    // tag:'5aeae0b936fcc00126c67ff0',
                    // articleId: Date.now(),
                    articleId,
                }
                Socket.emit('new_star', payload, callback);
            };

            $scope.likeArticle = function () {
                var callback = function (data) {
                    console.log(data);
                }
                var payload = {
                    articleId,
                }
                Socket.emit('like_article', payload, callback);
            };

            $scope.bookmarkArticle = function () {
                var callback = function (data) {
                    console.log(data);
                }
                var payload = {
                    articleId,
                }
                Socket.emit('bookmark_article', payload, callback);
            };

            $scope.sendValidation = function () {
                var payload = {
                    phone:$scope.input.phone,
                };
                var callback = function (data) {
                    console.log('sendValidation callback' + JSON.stringify(data));
                }
                Socket.emit('send_validation', payload, callback);
            };

            $scope.validateMobile = function () {
                var payload = {
                    phone:$scope.input.phone,
                    code:$scope.input.code,
                };
                var callback = function (data) {
                    console.log('validateMobile callback' + JSON.stringify(data));
                }
                Socket.emit('validate_mobile', payload, callback);
            };


            var queryCurUser = function () {
                $http.post('/pubsub/getUser').then(function (res) {
                    if (res && res.data) {
                        $scope.user = res.data;
                        initSocket();
                        $scope.getCourseComment();
                    }
                });
            };

            $scope.chooseSatisfaction = function (fid, status) {
                var message = $filter('filter')($scope.messages, { fid, msgType:'text' })[0];
                Socket.emit('chat', {
                    operation:{
                        method:'PUT_ONE',
                        table:'MESSAGE'
                    },
                    payload:{
                        _id:message._id,
                        satisfaction:status
                    }
                }, function (data) {
                    console.log(data);
                });
            };

            $scope.uploadPatientBasic = function () {
                /*
                [
                    {
                        "_id" : ObjectId("5afa019c532abd19a05b4131"),
                        "city" : "北京市",
                        "storeName" : "京卫大药房第四分店"
                    },
                    {
                        "_id" : ObjectId("5afa019c532abd19a05b4132"),
                        "city" : "北京市",
                        "storeName" : "北京永裕大药房"
                    },
                    {
                        "_id" : ObjectId("5afa019c532abd19a05b4133"),
                        "city" : "福州市",
                        "storeName" : "福州市宏利药店"
                    }
                ]
                */

                var payload = {
                    identity: '患者',
                    patientName: '李四' + timestamp,
                    gender:'男',
                    phone: '1886043' + timestamp,
                    drugStoreId: '5afa019c532abd19a05b4131'
                };
                var callback = function (data) {
                    console.log(data);
                }
                Socket.emit('patient_basic', payload, callback);
            };

            $scope.uploadPatientCancer = function () {
                var payload = {
                    treatments: ['手术','化疗','靶向'],
                    geneMutation: 'EGFR',
                };
                var callback = function (data) {
                    console.log('uploadPatientCancer callback' + JSON.stringify(data));
                }
                Socket.emit('patient_cancer', payload, callback);
            };

            var getCurPatient = function () {
                var callback = function (data) {
                    console.log(data.patient);
                }
                var payload = {
                    openid:$scope.user.openid
                }
                Socket.emit('get_patient', payload, callback);
            }


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
                        initSocket();
                        $scope.getCourseComment();
                    }
                    $scope.input.user = '';
                });
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
                return content ? content.replace("\\n","</br>") : '';
            };

            $scope.showJSON = function (content) {
                return JSON.stringify(content);
            };



            /*
            * 创建留言
            * @param content required 内容
            * @param articleId required 文章ID
            * @param userId required 用户ID（openid）
            * @param userName required 用户昵称
            * @param userHead required 用户头像
            */
            $scope.createCourseComment = function() {
                var payload = {
                    content:$scope.input.comment,
                    articleId,
                    articleTitle:"M1QA 胸腔积液是如何发生的？该怎么处理？",
                    userId:$scope.user.openid,
                    userName:$scope.user.nickname || $scope.user.name ,
                    userHead:"https://zlzhidao-resource.oss-cn-shenzhen.aliyuncs.com/user_profile/580ae68e13601d021aaffefa.jpeg"
                }
                var callback = function (data) {
                    console.log(data);
                }
                Socket.emit('create_comment', payload, callback);
            };



            /*
            * 获取文章评论
            * @param articleId required 文章ID
            * @param userId required 当前登录用户ID
            * @param page required 当前页
            * @param pageSize required 每页条数
            */
            $scope.getCourseComment = function() {
                var payload = {
                    articleId,
                    userId:$scope.user.openid,
                    page:1,
                    pageSize:10
                }
                var callback = function (data) {
                    console.log(data);
                    $scope.$apply(function () {
                        $scope.comments = data.list;
                    });
                }
                Socket.emit('get_article_comment', payload, callback);
            };




            /*
            * 点赞留言
            * @param userId required 用户ID
            * @param praiseType String required 点赞类型，article 或 comment
            * @param praiseId Boolean required 点赞对象id, article ID 或 comment ID
            * @param praise required (1:点赞；<1取消点赞)
            */
            $scope.praiseCourseComment = function (commentId) {
                var payload = {
                    userId:$scope.user.openid,
                    praiseId:commentId,
                    praiseType: 'comment',
                    praise: 1
                }
                var callback = function (data) {
                    console.log(data);
                }
                Socket.emit('praise', payload, callback);
            }


            // 获取课程
            $scope.getCurricula = function () {
                var callback = function (data) {
                    console.log(data);
                }
                Socket.emit('get_curricula', {}, callback);
            };

            // 某课程的文章分页查询
            $scope.getArticlePaging = function () {
                var payload = {
                    curriculaId, // 课程id
                    curriculaName:'xxx',
                    tag:'专家答疑',
                    page:1,
                    limit:5
                }
                var callback = function (data) {
                    console.log(data);
                }
                Socket.emit('get_article_paging', payload, callback);
            };

            // 查询一篇文章
            $scope.getOneArticle = function () {
                var payload = {
                    articleId,
                    //articleId:"5aed842a660d42003fd23c57",
                    tag:'1||专家答疑'
                }
                var callback = function (data) {
                    console.log(data);
                }
                Socket.emit('get_one_article', payload, callback);
            };

            // 查询已收藏文章
            $scope.getBookmarks = function () {
                var callback = function (data) {
                    console.log(data);
                }
                Socket.emit('get_bookmarks', {}, callback);
            };

            // 问题反馈
            $scope.newProblem = function () {
                var payload = {
                    userName:$scope.user.nickname || $scope.user.name,
                    content: $scope.input.problem,
                };
                var callback = function (data) {
                    console.log(data);
                };
                Socket.emit('new_problem', payload, callback);
            };

            $scope.test = function () {

                var payload = {
                    method:'GET',
                    originalUrl: '/miniprogram/api/detail_reaction/5a9fa5a3b82c5245bfdb0d5a',

                };

                // var payload = {
                //     method:'POST',   // 'GET' or 'POST'
                //     originalUrl: '/miniprogram/api/find_reaction',
                //     data:{      //'POST'要用的话,非必需
                //         categoryId: "5ac44f4530574e034170b375"
                //     }
                // };
                var callback = function (data) {
                    console.log(data);
                };
                Socket.emit('api_gateway', payload, callback);
            };

            $scope.topArticles = function () {

                var payload = {
                    top:3
                };
                var callback = function (data) {
                    console.log(data);
                };
                Socket.emit('top_articles', payload, callback);
            };

            $scope.getDrugStores = function () {
                var callback = function (data) {
                    console.log(data);
                };
                Socket.emit('get_drug_stores', {}, callback);
            };
        }
    ]);

angular.module('ZLSysApp.unsafe-filter', [])
    .filter('unsafe', function($sce) { return $sce.trustAsHtml; });