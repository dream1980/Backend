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
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.EncryptFinalResponse = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The EncryptFinalResponse model module.
   * @module model/EncryptFinalResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>EncryptFinalResponse</code>.
   * @alias module:model/EncryptFinalResponse
   * @class
   * @param cipher {Blob} Encrypted data.
   */
  var exports = function(cipher) {
    var _this = this;

    _this['cipher'] = cipher;
  };

  /**
   * Constructs a <code>EncryptFinalResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/EncryptFinalResponse} obj Optional instance to populate.
   * @return {module:model/EncryptFinalResponse} The populated <code>EncryptFinalResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('cipher')) {
        obj['cipher'] = ApiClient.convertToType(data['cipher'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * Encrypted data.
   * @member {Blob} cipher
   */
  exports.prototype['cipher'] = undefined;



  return exports;
}));


