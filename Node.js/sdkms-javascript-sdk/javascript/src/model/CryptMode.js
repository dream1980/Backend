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
    root.FortanixSdkmsRestApi.CryptMode = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';


  /**
   * Enum class CryptMode.
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
     * value: "CTR"
     * @const
     */
    "CTR": "CTR",
    /**
     * value: "OFB"
     * @const
     */
    "OFB": "OFB",
    /**
     * value: "GCM"
     * @const
     */
    "GCM": "GCM",
    /**
     * value: "CCM"
     * @const
     */
    "CCM": "CCM",
    /**
     * value: "PKCS1_V15"
     * @const
     */
    "PKCS1_V15": "PKCS1_V15",
    /**
     * value: "OAEP_MGF1_SHA1"
     * @const
     */
    "OAEP_MGF1_SHA1": "OAEP_MGF1_SHA1",
    /**
     * value: "OAEP_MGF1_SHA256"
     * @const
     */
    "OAEP_MGF1_SHA256": "OAEP_MGF1_SHA256",
    /**
     * value: "OAEP_MGF1_SHA384"
     * @const
     */
    "OAEP_MGF1_SHA384": "OAEP_MGF1_SHA384",
    /**
     * value: "OAEP_MGF1_SHA512"
     * @const
     */
    "OAEP_MGF1_SHA512": "OAEP_MGF1_SHA512"  };

  /**
   * Returns a <code>CryptMode</code> enum value from a Javascript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/CryptMode} The enum <code>CryptMode</code> value.
   */
  exports.constructFromObject = function(object) {
    return object;
  }

  return exports;
}));


