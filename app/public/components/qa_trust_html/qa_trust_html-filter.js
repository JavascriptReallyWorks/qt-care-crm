/**
 * Created by lele on 16/9/20.
 */
'use strict';

angular.module('QaApp.unsafe-filter', [])
    .filter('unsafe', function($sce) { return $sce.trustAsHtml; });
