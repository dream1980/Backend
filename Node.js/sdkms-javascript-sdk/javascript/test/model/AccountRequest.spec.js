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
    instance = new FortanixSdkmsRestApi.AccountRequest();
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

  describe('AccountRequest', function() {
    it('should create an instance of AccountRequest', function() {
      // uncomment below and update the code to test AccountRequest
      //var instane = new FortanixSdkmsRestApi.AccountRequest();
      //expect(instance).to.be.a(FortanixSdkmsRestApi.AccountRequest);
    });

    it('should have the property name (base name: "name")', function() {
      // uncomment below and update the code to test the property name
      //var instane = new FortanixSdkmsRestApi.AccountRequest();
      //expect(instance).to.be();
    });

    it('should have the property description (base name: "description")', function() {
      // uncomment below and update the code to test the property description
      //var instane = new FortanixSdkmsRestApi.AccountRequest();
      //expect(instance).to.be();
    });

    it('should have the property organization (base name: "organization")', function() {
      // uncomment below and update the code to test the property organization
      //var instane = new FortanixSdkmsRestApi.AccountRequest();
      //expect(instance).to.be();
    });

    it('should have the property country (base name: "country")', function() {
      // uncomment below and update the code to test the property country
      //var instane = new FortanixSdkmsRestApi.AccountRequest();
      //expect(instance).to.be();
    });

    it('should have the property phone (base name: "phone")', function() {
      // uncomment below and update the code to test the property phone
      //var instane = new FortanixSdkmsRestApi.AccountRequest();
      //expect(instance).to.be();
    });

    it('should have the property notificationPref (base name: "notification_pref")', function() {
      // uncomment below and update the code to test the property notificationPref
      //var instane = new FortanixSdkmsRestApi.AccountRequest();
      //expect(instance).to.be();
    });

    it('should have the property authConfig (base name: "auth_config")', function() {
      // uncomment below and update the code to test the property authConfig
      //var instane = new FortanixSdkmsRestApi.AccountRequest();
      //expect(instance).to.be();
    });

    it('should have the property addLoggingConfigs (base name: "add_logging_configs")', function() {
      // uncomment below and update the code to test the property addLoggingConfigs
      //var instane = new FortanixSdkmsRestApi.AccountRequest();
      //expect(instance).to.be();
    });

    it('should have the property modLoggingConfigs (base name: "mod_logging_configs")', function() {
      // uncomment below and update the code to test the property modLoggingConfigs
      //var instane = new FortanixSdkmsRestApi.AccountRequest();
      //expect(instance).to.be();
    });

    it('should have the property delLoggingConfigs (base name: "del_logging_configs")', function() {
      // uncomment below and update the code to test the property delLoggingConfigs
      //var instane = new FortanixSdkmsRestApi.AccountRequest();
      //expect(instance).to.be();
    });

    it('should have the property pendingSubscriptionChangeRequest (base name: "pending_subscription_change_request")', function() {
      // uncomment below and update the code to test the property pendingSubscriptionChangeRequest
      //var instane = new FortanixSdkmsRestApi.AccountRequest();
      //expect(instance).to.be();
    });

    it('should have the property enabled (base name: "enabled")', function() {
      // uncomment below and update the code to test the property enabled
      //var instane = new FortanixSdkmsRestApi.AccountRequest();
      //expect(instance).to.be();
    });

    it('should have the property subscription (base name: "subscription")', function() {
      // uncomment below and update the code to test the property subscription
      //var instane = new FortanixSdkmsRestApi.AccountRequest();
      //expect(instance).to.be();
    });

    it('should have the property customMetadata (base name: "custom_metadata")', function() {
      // uncomment below and update the code to test the property customMetadata
      //var instane = new FortanixSdkmsRestApi.AccountRequest();
      //expect(instance).to.be();
    });

  });

}));
