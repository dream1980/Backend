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
    root.FortanixSdkmsRestApi.U2fKey = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The U2fKey model module.
   * @module model/U2fKey
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>U2fKey</code>.
   * A U2F key that may be used for two factor authentication.
   * @alias module:model/U2fKey
   * @class
   * @param keyHandle {String} 
   * @param version {String} 
   */
  var exports = function(keyHandle, version) {
    var _this = this;

    _this['keyHandle'] = keyHandle;
    _this['version'] = version;
  };

  /**
   * Constructs a <code>U2fKey</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/U2fKey} obj Optional instance to populate.
   * @return {module:model/U2fKey} The populated <code>U2fKey</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('keyHandle')) {
        obj['keyHandle'] = ApiClient.convertToType(data['keyHandle'], 'String');
      }
      if (data.hasOwnProperty('version')) {
        obj['version'] = ApiClient.convertToType(data['version'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} keyHandle
   */
  exports.prototype['keyHandle'] = undefined;
  /**
   * @member {String} version
   */
  exports.prototype['version'] = undefined;



  return exports;
}));

