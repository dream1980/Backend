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
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/AppCredential'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./AppCredential'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.AppCredentialResponse = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.AppCredential);
  }
}(this, function(ApiClient, AppCredential) {
  'use strict';




  /**
   * The AppCredentialResponse model module.
   * @module model/AppCredentialResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>AppCredentialResponse</code>.
   * @alias module:model/AppCredentialResponse
   * @class
   * @param appId {String} Uuid format string, example - a41152ed-c26e-4c6e-a8d1-8820e36972c3
   * @param credential {module:model/AppCredential} 
   */
  var exports = function(appId, credential) {
    var _this = this;

    _this['app_id'] = appId;
    _this['credential'] = credential;
  };

  /**
   * Constructs a <code>AppCredentialResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AppCredentialResponse} obj Optional instance to populate.
   * @return {module:model/AppCredentialResponse} The populated <code>AppCredentialResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('app_id')) {
        obj['app_id'] = ApiClient.convertToType(data['app_id'], 'String');
      }
      if (data.hasOwnProperty('credential')) {
        obj['credential'] = AppCredential.constructFromObject(data['credential']);
      }
    }
    return obj;
  }

  /**
   * Uuid format string, example - a41152ed-c26e-4c6e-a8d1-8820e36972c3
   * @member {String} app_id
   */
  exports.prototype['app_id'] = undefined;
  /**
   * @member {module:model/AppCredential} credential
   */
  exports.prototype['credential'] = undefined;



  return exports;
}));


