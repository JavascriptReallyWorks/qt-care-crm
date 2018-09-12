/**
 * Created by Yang1 on 6/7/17.
 */

angular.module('ZLCsApp.drag-drop-directive', [])
    .directive('draggableText', function() {
        return function(scope, element) {
            var el = element[0];

            el.draggable = true;

            el.addEventListener(
                'dragstart',
                function(e) {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('Text', this.innerText);
                    this.classList.add('drag');
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragend',
                function(e) {
                    this.classList.remove('drag');
                    return false;
                },
                false
            );
        }
    })
    .directive('draggableImage', function() {
        return function(scope, element) {
            var el = element[0];

            el.draggable = true;

            el.addEventListener(
                'dragstart',
                function(e) {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('Image', this.src);
                    this.classList.add('drag');
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragend',
                function(e) {
                    this.classList.remove('drag');
                    return false;
                },
                false
            );
        }
    })
    .directive('droppableText', function() {
        return {
            restrict: 'A',
            scope: {
                etext:'=',
            },
            link: function(scope, element) {
                // again we need the native object
                var el = element[0];

                el.addEventListener(
                    'dragover',
                    function(e) {
                        e.dataTransfer.dropEffect = 'move';
                        // allows us to drop
                        if (e.preventDefault) e.preventDefault();
                        this.classList.add('over');
                        return false;
                    },
                    false
                );

                el.addEventListener(
                    'dragenter',
                    function(e) {
                        this.classList.add('over');
                        return false;
                    },
                    false
                );

                el.addEventListener(
                    'dragleave',
                    function(e) {
                        this.classList.remove('over');
                        return false;
                    },
                    false
                );

                el.addEventListener(
                    'drop',
                    function(e) {
                        // Stops some browsers from redirecting.
                        if (e.stopPropagation) e.stopPropagation();

                        this.classList.remove('over');

                        if(!e.dataTransfer.getData('Text')){
                            alert('请放入文字信息。');
                            return false;
                        }

                        // this.firstChild.textContent = e.dataTransfer.getData('Text');
                        scope.etext = e.dataTransfer.getData('Text');
                        scope.$apply();     // $scope.$apply() 刷新页面
                        /*
                        var binId = this.id;
                        var item = document.getElementById(e.dataTransfer.getData('Text'));
                        this.appendChild(item);
                        // call the passed drop function
                        scope.$apply(function(scope) {
                            var fn = scope.drop();
                            if ('undefined' !== typeof fn) {
                                fn(item.id, binId);
                            }
                        });
                        */

                        return false;
                    },
                    false
                );
            }
        }
    })
    .directive('droppableImage',['CsConst', function(CsConst) {
        return {
            restrict: 'A',
            scope: {
                fileinfo:'=',
                upload:'=',
                translation:'@'
            },
            link: function(scope, element) {
                // again we need the native object
                var el = element[0];

                el.addEventListener(
                    'dragover',
                    function(e) {
                        e.dataTransfer.dropEffect = 'move';
                        // allows us to drop
                        if (e.preventDefault) e.preventDefault();
                        this.classList.add('over');
                        return false;
                    },
                    false
                );

                el.addEventListener(
                    'dragenter',
                    function(e) {
                        this.classList.add('over');
                        return false;
                    },
                    false
                );

                el.addEventListener(
                    'dragleave',
                    function(e) {
                        this.classList.remove('over');
                        return false;
                    },
                    false
                );

                el.addEventListener(
                    'drop',
                    function(e) {
                        e = e || window.event;
                        if (e.preventDefault) { e.preventDefault(); } // stops the browser from redirecting off to the image.
                        if (e.stopPropagation) e.stopPropagation();

                        this.classList.remove('over');

                        /*
                        if(!e.dataTransfer.getData('Image')){
                            alert('请放入图片。');
                            return false;
                        }
                        */

                        if(e.dataTransfer.getData('Image')) {   // 微信对话中已上传oss的图片
                            var newItem = {};
                            var properties = scope.fileinfo.properties;
                            for (var i = 0; i < properties.length; i++) {
                                var property = properties[i];
                                if (property === 'ossFileKey'){
                                    //   "//zlzhidao-resource.oss-cn-shenzhen.aliyuncs.com/user_profile/pgHBOoaD7vvu4obZgPPNJvRG1RbO8WBX8NyHfBLH6JsCXTNeOt0VCNGOfoiaBBjg.jpg"
                                    newItem[property] = e.dataTransfer.getData('Image').split("url=")[1].replace(/^\/+/,'').split("aliyuncs.com/")[1];
                                }
                                else if (property === 'documentName') {
                                    newItem[property] = "WECHAT_IMAGE" + new Date().getTime() +  ".jpg";
                                }
                                else
                                    newItem[property] = null;
                            }
                            scope.fileinfo.value.unshift(newItem);
                            scope.$apply();
                        }
                        else if (e.dataTransfer.files.length > 0){      // 本地拖入的文件
                            scope.upload(e.dataTransfer.files, scope.fileinfo, scope.translation);
                        }
                        else{
                            alert('请放入文件。');
                            return false;
                        }
                        return false;
                    },
                    false
                );
            }
        }
    }]);

