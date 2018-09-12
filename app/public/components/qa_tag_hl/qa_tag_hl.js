/**
 * Created by lele on 16/9/20.
 */
'use strict';

angular.module('QaApp.tag-hl-filter', [])
.filter("taghl",function(){
    return function(h,tag){
        try{

            var tags = tag.toString().replace(/,/ig,"|");
           /* console.log(h);
            h.filter(function (i, el) {
                return el.nodeType === 3;
            }).each(function (i, el) {
                var $el = $(el);
                var replaced = h.replace(new RegExp("(" + tags + ".*?)","gim"), '<span style="color:red">$1</span>');
                $el.replaceWith(replaced)
            });*/

            var replaced = h.replace(new RegExp("(" + tags + ".*?)","gim"), '<span style="color:red">$1</span>');
            return replaced;


            /*if(tag) {

                if(Object.prototype.toString.call(tag)=='[object Array]'){
                    tag = tag.join(",").replace(/,/g,"|")
                }
                var reg = RegExp(tag,"ig");
                var m = h.match(reg);
                if(m && m.join("").length>0){
                    for(var i = 0;i<m.length;i++){
                        var nt = '<span style="color:red">'+m[i]+"</span>";
                        h = h.replace(m[i],nt);
                    }
                }
                return h;
            }else{
                return h;
            }*/

        }
        catch (err){
            console.log(err.name+":"+err.message)
        }
    }
});
