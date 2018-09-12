/**
 * Created by lele on 16/6/24.
 */
'use strict';

angular.module('ZLApp.contain-filter', [])
    .filter("contain",function(){
        return function(array,str){
            try{
                if(array.indexOf(str) == -1){
                    return false;
                }
                return true;
            }
            catch (err){
                console.log(err.name+":"+err.message)
            }
        }
    });
