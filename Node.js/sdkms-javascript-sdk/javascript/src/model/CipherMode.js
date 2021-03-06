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
    root.FortanixSdkmsRestApi.CipherMode = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';


  /**
   * Enum class CipherMode.
   * @enum {}
   * @readonly
   */
  var exports = {
    /**
     * value: "ECB"
     * @const
     */
    "ECB": "ECB",
    /**
     * value: "CBC"
     * @const
     */
    "CBC": "CBC",
    /**
     * value: "CBCNOPAD"
     * @const
     */
    "CBCNOPAD": "CBCNOPAD",
    /**
     * value: "CFB"
     * @const
     */
    "CFB": "CFB",
    /**
     * value: "OFB"
     * @const
     */
    "OFB": "OFB",
    /**
     * value: "CTR"
     * @const
     */
    "CTR": "CTR",
    /**
     * value: "GCM"
     * @const
     */
    "GCM": "GCM",
    /**
     * value: "CCM"
     * @const
     */
    "CCM": "CCM"  };

  /**
   * Returns a <code>CipherMode</code> enum value from a Javascript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/CipherMode} The enum <code>CipherMode</code> value.
   */
  exports.constructFromObject = function(object) {
    return object;
  }

  return exports;
}));


