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
    root.FortanixSdkmsRestApi.ApprovableResult = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The ApprovableResult model module.
   * @module model/ApprovableResult
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>ApprovableResult</code>.
   * @alias module:model/ApprovableResult
   * @class
   * @param status {Number} The HTTP status code for this partial request.
   * @param body {Object} 
   */
  var exports = function(status, body) {
    var _this = this;

    _this['status'] = status;
    _this['body'] = body;
  };

  /**
   * Constructs a <code>ApprovableResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ApprovableResult} obj Optional instance to populate.
   * @return {module:model/ApprovableResult} The populated <code>ApprovableResult</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'Number');
      }
      if (data.hasOwnProperty('body')) {
        obj['body'] = ApiClient.convertToType(data['body'], Object);
      }
    }
    return obj;
  }

  /**
   * The HTTP status code for this partial request.
   * @member {Number} status
   */
  exports.prototype['status'] = undefined;
  /**
   * @member {Object} body
   */
  exports.prototype['body'] = undefined;



  return exports;
}));


