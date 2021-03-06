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
    instance = new FortanixSdkmsRestApi.AgreeKeyRequest();
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

  describe('AgreeKeyRequest', function() {
    it('should create an instance of AgreeKeyRequest', function() {
      // uncomment below and update the code to test AgreeKeyRequest
      //var instane = new FortanixSdkmsRestApi.AgreeKeyRequest();
      //expect(instance).to.be.a(FortanixSdkmsRestApi.AgreeKeyRequest);
    });

    it('should have the property privateKey (base name: "private_key")', function() {
      // uncomment below and update the code to test the property privateKey
      //var instane = new FortanixSdkmsRestApi.AgreeKeyRequest();
      //expect(instance).to.be();
    });

    it('should have the property publicKey (base name: "public_key")', function() {
      // uncomment below and update the code to test the property publicKey
      //var instane = new FortanixSdkmsRestApi.AgreeKeyRequest();
      //expect(instance).to.be();
    });

    it('should have the property name (base name: "name")', function() {
      // uncomment below and update the code to test the property name
      //var instane = new FortanixSdkmsRestApi.AgreeKeyRequest();
      //expect(instance).to.be();
    });

    it('should have the property groupId (base name: "group_id")', function() {
      // uncomment below and update the code to test the property groupId
      //var instane = new FortanixSdkmsRestApi.AgreeKeyRequest();
      //expect(instance).to.be();
    });

    it('should have the property keySize (base name: "key_size")', function() {
      // uncomment below and update the code to test the property keySize
      //var instane = new FortanixSdkmsRestApi.AgreeKeyRequest();
      //expect(instance).to.be();
    });

    it('should have the property keyType (base name: "key_type")', function() {
      // uncomment below and update the code to test the property keyType
      //var instane = new FortanixSdkmsRestApi.AgreeKeyRequest();
      //expect(instance).to.be();
    });

    it('should have the property mechanism (base name: "mechanism")', function() {
      // uncomment below and update the code to test the property mechanism
      //var instane = new FortanixSdkmsRestApi.AgreeKeyRequest();
      //expect(instance).to.be();
    });

    it('should have the property enabled (base name: "enabled")', function() {
      // uncomment below and update the code to test the property enabled
      //var instane = new FortanixSdkmsRestApi.AgreeKeyRequest();
      //expect(instance).to.be();
    });

    it('should have the property description (base name: "description")', function() {
      // uncomment below and update the code to test the property description
      //var instane = new FortanixSdkmsRestApi.AgreeKeyRequest();
      //expect(instance).to.be();
    });

    it('should have the property keyOps (base name: "key_ops")', function() {
      // uncomment below and update the code to test the property keyOps
      //var instane = new FortanixSdkmsRestApi.AgreeKeyRequest();
      //expect(instance).to.be();
    });

    it('should have the property customMetadata (base name: "custom_metadata")', function() {
      // uncomment below and update the code to test the property customMetadata
      //var instane = new FortanixSdkmsRestApi.AgreeKeyRequest();
      //expect(instance).to.be();
    });

    it('should have the property _transient (base name: "transient")', function() {
      // uncomment below and update the code to test the property _transient
      //var instane = new FortanixSdkmsRestApi.AgreeKeyRequest();
      //expect(instance).to.be();
    });

  });

}));
