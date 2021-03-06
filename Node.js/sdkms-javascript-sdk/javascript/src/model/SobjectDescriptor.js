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
    root.FortanixSdkmsRestApi.SobjectDescriptor = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The SobjectDescriptor model module.
   * @module model/SobjectDescriptor
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>SobjectDescriptor</code>.
   * This uniquely identifies a persisted or transient sobject. Exactly one of &#x60;kid&#x60;, &#x60;name&#x60;, and &#x60;transient_key&#x60; must be present. 
   * @alias module:model/SobjectDescriptor
   * @class
   */
  var exports = function() {
    var _this = this;




  };

  /**
   * Constructs a <code>SobjectDescriptor</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SobjectDescriptor} obj Optional instance to populate.
   * @return {module:model/SobjectDescriptor} The populated <code>SobjectDescriptor</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('kid')) {
        obj['kid'] = ApiClient.convertToType(data['kid'], 'String');
      }
      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('transient_key')) {
        obj['transient_key'] = ApiClient.convertToType(data['transient_key'], 'String');
      }
    }
    return obj;
  }

  /**
   * Key ID uniquely identifying this persisted security object.
   * @member {String} kid
   */
  exports.prototype['kid'] = undefined;
  /**
   * Name of this persisted security object.
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Transient key blob.
   * @member {String} transient_key
   */
  exports.prototype['transient_key'] = undefined;



  return exports;
}));


