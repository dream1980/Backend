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
    define(['ApiClient', 'model/BatchDecryptRequestInner'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./BatchDecryptRequestInner'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.BatchDecryptRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.BatchDecryptRequestInner);
  }
}(this, function(ApiClient, BatchDecryptRequestInner) {
  'use strict';




  /**
   * The BatchDecryptRequest model module.
   * @module model/BatchDecryptRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>BatchDecryptRequest</code>.
   * @alias module:model/BatchDecryptRequest
   * @class
   * @extends Array
   */
  var exports = function() {
    var _this = this;
    _this = new Array();
    Object.setPrototypeOf(_this, exports);

    return _this;
  };

  /**
   * Constructs a <code>BatchDecryptRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/BatchDecryptRequest} obj Optional instance to populate.
   * @return {module:model/BatchDecryptRequest} The populated <code>BatchDecryptRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();
      ApiClient.constructFromObject(data, obj, 'BatchDecryptRequestInner');

    }
    return obj;
  }




  return exports;
}));


