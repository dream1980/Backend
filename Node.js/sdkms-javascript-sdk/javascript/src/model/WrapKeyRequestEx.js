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
    define(['ApiClient', 'model/CryptMode', 'model/ObjectType', 'model/SobjectDescriptor'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./CryptMode'), require('./ObjectType'), require('./SobjectDescriptor'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.WrapKeyRequestEx = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.CryptMode, root.FortanixSdkmsRestApi.ObjectType, root.FortanixSdkmsRestApi.SobjectDescriptor);
  }
}(this, function(ApiClient, CryptMode, ObjectType, SobjectDescriptor) {
  'use strict';




  /**
   * The WrapKeyRequestEx model module.
   * @module model/WrapKeyRequestEx
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>WrapKeyRequestEx</code>.
   * @alias module:model/WrapKeyRequestEx
   * @class
   * @param key {module:model/SobjectDescriptor} 
   * @param subject {module:model/SobjectDescriptor} 
   * @param alg {module:model/ObjectType} 
   */
  var exports = function(key, subject, alg) {
    var _this = this;

    _this['key'] = key;
    _this['subject'] = subject;
    _this['alg'] = alg;




  };

  /**
   * Constructs a <code>WrapKeyRequestEx</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/WrapKeyRequestEx} obj Optional instance to populate.
   * @return {module:model/WrapKeyRequestEx} The populated <code>WrapKeyRequestEx</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('key')) {
        obj['key'] = SobjectDescriptor.constructFromObject(data['key']);
      }
      if (data.hasOwnProperty('subject')) {
        obj['subject'] = SobjectDescriptor.constructFromObject(data['subject']);
      }
      if (data.hasOwnProperty('alg')) {
        obj['alg'] = ObjectType.constructFromObject(data['alg']);
      }
      if (data.hasOwnProperty('mode')) {
        obj['mode'] = CryptMode.constructFromObject(data['mode']);
      }
      if (data.hasOwnProperty('iv')) {
        obj['iv'] = ApiClient.convertToType(data['iv'], 'Blob');
      }
      if (data.hasOwnProperty('ad')) {
        obj['ad'] = ApiClient.convertToType(data['ad'], 'Blob');
      }
      if (data.hasOwnProperty('tag_len')) {
        obj['tag_len'] = ApiClient.convertToType(data['tag_len'], 'Number');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/SobjectDescriptor} key
   */
  exports.prototype['key'] = undefined;
  /**
   * @member {module:model/SobjectDescriptor} subject
   */
  exports.prototype['subject'] = undefined;
  /**
   * @member {module:model/ObjectType} alg
   */
  exports.prototype['alg'] = undefined;
  /**
   * @member {module:model/CryptMode} mode
   */
  exports.prototype['mode'] = undefined;
  /**
   * For symmetric ciphers, this value will be used for the cipher initialization value. If not provided, SDKMS will generate a random iv and return it in the response. If provided, iv length must match the length required by the cipher and mode. 
   * @member {Blob} iv
   */
  exports.prototype['iv'] = undefined;
  /**
   * For symmetric ciphers with cipher mode GCM or CCM, this optionally specifies the authenticated data used by the cipher. This field must not be provided with other cipher modes. 
   * @member {Blob} ad
   */
  exports.prototype['ad'] = undefined;
  /**
   * For symmetric ciphers with cipher mode GCM or CCM, this field specifies the length of the authentication tag to be produced. This field is specified in bits (not bytes). This field is required for symmetric ciphers with cipher mode GCM or CCM. It must not be specified for asymmetric ciphers and symmetric ciphers with other cipher modes.
   * @member {Number} tag_len
   */
  exports.prototype['tag_len'] = undefined;



  return exports;
}));

