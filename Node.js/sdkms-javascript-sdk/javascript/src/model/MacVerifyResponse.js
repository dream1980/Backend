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
    root.FortanixSdkmsRestApi.MacVerifyResponse = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The MacVerifyResponse model module.
   * @module model/MacVerifyResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>MacVerifyResponse</code>.
   * @alias module:model/MacVerifyResponse
   * @class
   * @param result {Boolean} True if the MAC successfully verified, and false if it did not.
   */
  var exports = function(result) {
    var _this = this;


    _this['result'] = result;
  };

  /**
   * Constructs a <code>MacVerifyResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/MacVerifyResponse} obj Optional instance to populate.
   * @return {module:model/MacVerifyResponse} The populated <code>MacVerifyResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('kid')) {
        obj['kid'] = ApiClient.convertToType(data['kid'], 'String');
      }
      if (data.hasOwnProperty('result')) {
        obj['result'] = ApiClient.convertToType(data['result'], 'Boolean');
      }
    }
    return obj;
  }

  /**
   * Key ID of the key used to verify the MAC.
   * @member {String} kid
   */
  exports.prototype['kid'] = undefined;
  /**
   * True if the MAC successfully verified, and false if it did not.
   * @member {Boolean} result
   */
  exports.prototype['result'] = undefined;



  return exports;
}));


