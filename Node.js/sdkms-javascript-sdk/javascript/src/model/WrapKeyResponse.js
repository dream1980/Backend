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
    root.FortanixSdkmsRestApi.WrapKeyResponse = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The WrapKeyResponse model module.
   * @module model/WrapKeyResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>WrapKeyResponse</code>.
   * @alias module:model/WrapKeyResponse
   * @class
   * @param wrappedKey {Blob} The wrapped key.
   */
  var exports = function(wrappedKey) {
    var _this = this;

    _this['wrapped_key'] = wrappedKey;


  };

  /**
   * Constructs a <code>WrapKeyResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/WrapKeyResponse} obj Optional instance to populate.
   * @return {module:model/WrapKeyResponse} The populated <code>WrapKeyResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('wrapped_key')) {
        obj['wrapped_key'] = ApiClient.convertToType(data['wrapped_key'], 'Blob');
      }
      if (data.hasOwnProperty('iv')) {
        obj['iv'] = ApiClient.convertToType(data['iv'], 'Blob');
      }
      if (data.hasOwnProperty('tag')) {
        obj['tag'] = ApiClient.convertToType(data['tag'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * The wrapped key.
   * @member {Blob} wrapped_key
   */
  exports.prototype['wrapped_key'] = undefined;
  /**
   * The initialiation value used for symmetric encryption. Not returned for asymmetric ciphers.
   * @member {Blob} iv
   */
  exports.prototype['iv'] = undefined;
  /**
   * For symmetric ciphers with cipher mode GCM or CCM, the authentication tag produced by the cipher. Its length will match the tag length specified by the encryption request. 
   * @member {Blob} tag
   */
  exports.prototype['tag'] = undefined;



  return exports;
}));

