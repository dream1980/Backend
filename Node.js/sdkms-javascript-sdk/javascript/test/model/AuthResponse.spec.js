/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['expect.js', '../../src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require('../../src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.FortanixSdkmsRestApi);
  }
}(this, function(expect, FortanixSdkmsRestApi) {
  'use strict';

  var instance;

  beforeEach(function() {
    instance = new FortanixSdkmsRestApi.AuthResponse();
  });

  var getProperty = function(object, getter, property) {
    // Use getter method if present; otherwise, get the property directly.
    if (typeof object[getter] === 'function')
      return object[getter]();
    else
      return object[property];
  }

  var setProperty = function(object, setter, property, value) {
    // Use setter method if present; otherwise, set the property directly.
    if (typeof object[setter] === 'function')
      object[setter](value);
    else
      object[property] = value;
  }

  describe('AuthResponse', function() {
    it('should create an instance of AuthResponse', function() {
      // uncomment below and update the code to test AuthResponse
      //var instane = new FortanixSdkmsRestApi.AuthResponse();
      //expect(instance).to.be.a(FortanixSdkmsRestApi.AuthResponse);
    });

    it('should have the property expiresIn (base name: "expires_in")', function() {
      // uncomment below and update the code to test the property expiresIn
      //var instane = new FortanixSdkmsRestApi.AuthResponse();
      //expect(instance).to.be();
    });

    it('should have the property accessToken (base name: "access_token")', function() {
      // uncomment below and update the code to test the property accessToken
      //var instane = new FortanixSdkmsRestApi.AuthResponse();
      //expect(instance).to.be();
    });

    it('should have the property entityId (base name: "entity_id")', function() {
      // uncomment below and update the code to test the property entityId
      //var instane = new FortanixSdkmsRestApi.AuthResponse();
      //expect(instance).to.be();
    });

  });

}));
