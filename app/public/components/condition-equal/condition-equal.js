/**
 * Created by lele on 16/6/24.
 */
'use strict';

angular.module('ZLApp.condition-equal', [])
    .filter("conditionEqual",function(){
        return function(data,str){

            try{
                if(data && typeof data ==='object' && Array == data.constructor){
                    if(data.length <= 0){
                        data.push(undefined);
                    }
                    if(data.indexOf(str) != -1){
                        return true;
                    }
                }else if(typeof(data) == "object"){
                    //data.value = data.value == undefined ? 'undefined' : data.value;
                    if(data.value == str){
                        return true;
                    }
                }else if(data == undefined){
                    //data = 'undefined';
                    if(data == str){
                        return true;
                    }
                }else{
                    if(data == str){
                        return true;
                    }
                }
                return false;
            }
            catch (err){
                console.log(err.name+":"+err.message)
            }
        }
    })
    .filter("conditionEqual2",function(){
        return function(data,str){
            try{
                if(data && typeof data ==='object' && Array == data.constructor){

                    if(data.indexOf(str) != -1){
                        return true;
                    }
                }else if(typeof(data) == "object"){
                    if(data.value == str){
                        return true;
                    }
                }else{
                    if(data == str){
                        return true;
                    }
                }
                return false;
            }
            catch (err){
                console.log(err.name+":"+err.message)
            }
        }
    });
