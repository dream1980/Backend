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
    define(['ApiClient', 'model/EncryptRequest'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./EncryptRequest'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.BatchEncryptRequestInner = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.EncryptRequest);
  }
}(this, function(ApiClient, EncryptRequest) {
  'use strict';




  /**
   * The BatchEncryptRequestInner model module.
   * @module model/BatchEncryptRequestInner
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>BatchEncryptRequestInner</code>.
   * @alias module:model/BatchEncryptRequestInner
   * @class
   * @param kid {String} Key ID (not name or description) of the key to use to encrypt request. 
   * @param request {module:model/EncryptRequest} 
   */
  var exports = function(kid, request) {
    var _this = this;

    _this['kid'] = kid;
    _this['request'] = request;
  };

  /**
   * Constructs a <code>BatchEncryptRequestInner</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/BatchEncryptRequestInner} obj Optional instance to populate.
   * @return {module:model/BatchEncryptRequestInner} The populated <code>BatchEncryptRequestInner</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('kid')) {
        obj['kid'] = ApiClient.convertToType(data['kid'], 'String');
      }
      if (data.hasOwnProperty('request')) {
        obj['request'] = EncryptRequest.constructFromObject(data['request']);
      }
    }
    return obj;
  }

  /**
   * Key ID (not name or description) of the key to use to encrypt request. 
   * @member {String} kid
   */
  exports.prototype['kid'] = undefined;
  /**
   * @member {module:model/EncryptRequest} request
   */
  exports.prototype['request'] = undefined;



  return exports;
}));


