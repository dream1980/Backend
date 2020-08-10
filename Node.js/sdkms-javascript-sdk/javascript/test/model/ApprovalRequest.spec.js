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
    instance = new FortanixSdkmsRestApi.ApprovalRequest();
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

  describe('ApprovalRequest', function() {
    it('should create an instance of ApprovalRequest', function() {
      // uncomment below and update the code to test ApprovalRequest
      //var instane = new FortanixSdkmsRestApi.ApprovalRequest();
      //expect(instance).to.be.a(FortanixSdkmsRestApi.ApprovalRequest);
    });

    it('should have the property requestId (base name: "request_id")', function() {
      // uncomment below and update the code to test the property requestId
      //var instane = new FortanixSdkmsRestApi.ApprovalRequest();
      //expect(instance).to.be();
    });

    it('should have the property requester (base name: "requester")', function() {
      // uncomment below and update the code to test the property requester
      //var instane = new FortanixSdkmsRestApi.ApprovalRequest();
      //expect(instance).to.be();
    });

    it('should have the property createdAt (base name: "created_at")', function() {
      // uncomment below and update the code to test the property createdAt
      //var instane = new FortanixSdkmsRestApi.ApprovalRequest();
      //expect(instance).to.be();
    });

    it('should have the property acctId (base name: "acct_id")', function() {
      // uncomment below and update the code to test the property acctId
      //var instane = new FortanixSdkmsRestApi.ApprovalRequest();
      //expect(instance).to.be();
    });

    it('should have the property operation (base name: "operation")', function() {
      // uncomment below and update the code to test the property operation
      //var instane = new FortanixSdkmsRestApi.ApprovalRequest();
      //expect(instance).to.be();
    });

    it('should have the property method (base name: "method")', function() {
      // uncomment below and update the code to test the property method
      //var instane = new FortanixSdkmsRestApi.ApprovalRequest();
      //expect(instance).to.be();
    });

    it('should have the property body (base name: "body")', function() {
      // uncomment below and update the code to test the property body
      //var instane = new FortanixSdkmsRestApi.ApprovalRequest();
      //expect(instance).to.be();
    });

    it('should have the property approvers (base name: "approvers")', function() {
      // uncomment below and update the code to test the property approvers
      //var instane = new FortanixSdkmsRestApi.ApprovalRequest();
      //expect(instance).to.be();
    });

    it('should have the property denier (base name: "denier")', function() {
      // uncomment below and update the code to test the property denier
      //var instane = new FortanixSdkmsRestApi.ApprovalRequest();
      //expect(instance).to.be();
    });

    it('should have the property status (base name: "status")', function() {
      // uncomment below and update the code to test the property status
      //var instane = new FortanixSdkmsRestApi.ApprovalRequest();
      //expect(instance).to.be();
    });

    it('should have the property reviewers (base name: "reviewers")', function() {
      // uncomment below and update the code to test the property reviewers
      //var instane = new FortanixSdkmsRestApi.ApprovalRequest();
      //expect(instance).to.be();
    });

    it('should have the property subjects (base name: "subjects")', function() {
      // uncomment below and update the code to test the property subjects
      //var instane = new FortanixSdkmsRestApi.ApprovalRequest();
      //expect(instance).to.be();
    });

    it('should have the property description (base name: "description")', function() {
      // uncomment below and update the code to test the property description
      //var instane = new FortanixSdkmsRestApi.ApprovalRequest();
      //expect(instance).to.be();
    });

    it('should have the property expiry (base name: "expiry")', function() {
      // uncomment below and update the code to test the property expiry
      //var instane = new FortanixSdkmsRestApi.ApprovalRequest();
      //expect(instance).to.be();
    });

  });

}));