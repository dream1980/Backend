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
    root.FortanixSdkmsRestApi.U2fAddDeviceRequest = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The U2fAddDeviceRequest model module.
   * @module model/U2fAddDeviceRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>U2fAddDeviceRequest</code>.
   * Description of a U2F device to add for two factor authentication.
   * @alias module:model/U2fAddDeviceRequest
   * @class
   * @param name {String} 
   * @param registrationData {String} 
   * @param clientData {String} 
   * @param version {String} 
   */
  var exports = function(name, registrationData, clientData, version) {
    var _this = this;

    _this['name'] = name;
    _this['registrationData'] = registrationData;
    _this['clientData'] = clientData;
    _this['version'] = version;
  };

  /**
   * Constructs a <code>U2fAddDeviceRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/U2fAddDeviceRequest} obj Optional instance to populate.
   * @return {module:model/U2fAddDeviceRequest} The populated <code>U2fAddDeviceRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('registrationData')) {
        obj['registrationData'] = ApiClient.convertToType(data['registrationData'], 'String');
      }
      if (data.hasOwnProperty('clientData')) {
        obj['clientData'] = ApiClient.convertToType(data['clientData'], 'String');
      }
      if (data.hasOwnProperty('version')) {
        obj['version'] = ApiClient.convertToType(data['version'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * @member {String} registrationData
   */
  exports.prototype['registrationData'] = undefined;
  /**
   * @member {String} clientData
   */
  exports.prototype['clientData'] = undefined;
  /**
   * @member {String} version
   */
  exports.prototype['version'] = undefined;



  return exports;
}));


