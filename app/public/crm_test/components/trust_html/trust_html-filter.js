/**
 * Created by lele on 16/9/20.
 */
'use strict';

angular.module('ZLApp.unsafe-filter', [])
    .filter('unsafe', function($sce) { return $sce.trustAsHtml; })
    .name;
