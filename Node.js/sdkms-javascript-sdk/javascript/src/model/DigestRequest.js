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
    define(['ApiClient', 'model/DigestAlgorithm'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./DigestAlgorithm'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.DigestRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.DigestAlgorithm);
  }
}(this, function(ApiClient, DigestAlgorithm) {
  'use strict';




  /**
   * The DigestRequest model module.
   * @module model/DigestRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>DigestRequest</code>.
   * @alias module:model/DigestRequest
   * @class
   * @param alg {module:model/DigestAlgorithm} 
   * @param data {Blob} Data to be hashed.
   */
  var exports = function(alg, data) {
    var _this = this;

    _this['alg'] = alg;
    _this['data'] = data;
  };

  /**
   * Constructs a <code>DigestRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/DigestRequest} obj Optional instance to populate.
   * @return {module:model/DigestRequest} The populated <code>DigestRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('alg')) {
        obj['alg'] = DigestAlgorithm.constructFromObject(data['alg']);
      }
      if (data.hasOwnProperty('data')) {
        obj['data'] = ApiClient.convertToType(data['data'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/DigestAlgorithm} alg
   */
  exports.prototype['alg'] = undefined;
  /**
   * Data to be hashed.
   * @member {Blob} data
   */
  exports.prototype['data'] = undefined;



  return exports;
}));


