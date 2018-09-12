'use strict';

angular.module('ZLApp.version', [
  'ZLApp.version.interpolate-filter',
  'ZLApp.version.version-directive'
])

.value('version', '0.1');
