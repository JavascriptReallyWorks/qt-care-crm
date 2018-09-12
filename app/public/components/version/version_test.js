'use strict';

describe('ZLApp.version module', function() {
  beforeEach(module('ZLApp.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
