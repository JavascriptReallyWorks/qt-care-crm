/**
 * Created by lele on 16/9/20.
 */
'use strict';

module.exports = angular.module('ZLApp.unsafe-filter', [])
    .filter('unsafe', function($sce) { return $sce.trustAsHtml; })
    .name;
