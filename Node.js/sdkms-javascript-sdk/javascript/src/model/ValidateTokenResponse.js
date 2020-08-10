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
    root.FortanixSdkmsRestApi.ValidateTokenResponse = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The ValidateTokenResponse model module.
   * @module model/ValidateTokenResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>ValidateTokenResponse</code>.
   * @alias module:model/ValidateTokenResponse
   * @class
   * @param userEmail {String} 
   */
  var exports = function(userEmail) {
    var _this = this;

    _this['user_email'] = userEmail;
  };

  /**
   * Constructs a <code>ValidateTokenResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ValidateTokenResponse} obj Optional instance to populate.
   * @return {module:model/ValidateTokenResponse} The populated <code>ValidateTokenResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('user_email')) {
        obj['user_email'] = ApiClient.convertToType(data['user_email'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} user_email
   */
  exports.prototype['user_email'] = undefined;



  return exports;
}));


