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
    root.FortanixSdkmsRestApi.EncryptUpdateRequest = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The EncryptUpdateRequest model module.
   * @module model/EncryptUpdateRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>EncryptUpdateRequest</code>.
   * all fields are required
   * @alias module:model/EncryptUpdateRequest
   * @class
   * @param plain {Blob} Plaintext to encrypt.
   * @param state {Blob} 
   */
  var exports = function(plain, state) {
    var _this = this;

    _this['plain'] = plain;
    _this['state'] = state;
  };

  /**
   * Constructs a <code>EncryptUpdateRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/EncryptUpdateRequest} obj Optional instance to populate.
   * @return {module:model/EncryptUpdateRequest} The populated <code>EncryptUpdateRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('plain')) {
        obj['plain'] = ApiClient.convertToType(data['plain'], 'Blob');
      }
      if (data.hasOwnProperty('state')) {
        obj['state'] = ApiClient.convertToType(data['state'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * Plaintext to encrypt.
   * @member {Blob} plain
   */
  exports.prototype['plain'] = undefined;
  /**
   * @member {Blob} state
   */
  exports.prototype['state'] = undefined;



  return exports;
}));

