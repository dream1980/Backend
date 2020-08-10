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
    define(['ApiClient', 'model/AgreeKeyMechanism', 'model/KeyOperations', 'model/ObjectType', 'model/SobjectDescriptor'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./AgreeKeyMechanism'), require('./KeyOperations'), require('./ObjectType'), require('./SobjectDescriptor'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.AgreeKeyRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.AgreeKeyMechanism, root.FortanixSdkmsRestApi.KeyOperations, root.FortanixSdkmsRestApi.ObjectType, root.FortanixSdkmsRestApi.SobjectDescriptor);
  }
}(this, function(ApiClient, AgreeKeyMechanism, KeyOperations, ObjectType, SobjectDescriptor) {
  'use strict';




  /**
   * The AgreeKeyRequest model module.
   * @module model/AgreeKeyRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>AgreeKeyRequest</code>.
   * @alias module:model/AgreeKeyRequest
   * @class
   * @param privateKey {module:model/SobjectDescriptor} 
   * @param publicKey {module:model/SobjectDescriptor} 
   * @param name {String} Name of the agreed-upon key. Key names must be unique within an account. The name is ignored for transient keys and should be the empty string.
   * @param keySize {Number} Key size of the derived key in bits (not bytes).
   * @param keyType {module:model/ObjectType} 
   * @param mechanism {module:model/AgreeKeyMechanism} 
   */
  var exports = function(privateKey, publicKey, name, keySize, keyType, mechanism) {
    var _this = this;

    _this['private_key'] = privateKey;
    _this['public_key'] = publicKey;
    _this['name'] = name;

    _this['key_size'] = keySize;
    _this['key_type'] = keyType;
    _this['mechanism'] = mechanism;





  };

  /**
   * Constructs a <code>AgreeKeyRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AgreeKeyRequest} obj Optional instance to populate.
   * @return {module:model/AgreeKeyRequest} The populated <code>AgreeKeyRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('private_key')) {
        obj['private_key'] = SobjectDescriptor.constructFromObject(data['private_key']);
      }
      if (data.hasOwnProperty('public_key')) {
        obj['public_key'] = SobjectDescriptor.constructFromObject(data['public_key']);
      }
      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('group_id')) {
        obj['group_id'] = ApiClient.convertToType(data['group_id'], 'String');
      }
      if (data.hasOwnProperty('key_size')) {
        obj['key_size'] = ApiClient.convertToType(data['key_size'], 'Number');
      }
      if (data.hasOwnProperty('key_type')) {
        obj['key_type'] = ObjectType.constructFromObject(data['key_type']);
      }
      if (data.hasOwnProperty('mechanism')) {
        obj['mechanism'] = AgreeKeyMechanism.constructFromObject(data['mechanism']);
      }
      if (data.hasOwnProperty('enabled')) {
        obj['enabled'] = ApiClient.convertToType(data['enabled'], 'Boolean');
      }
      if (data.hasOwnProperty('description')) {
        obj['description'] = ApiClient.convertToType(data['description'], 'String');
      }
      if (data.hasOwnProperty('key_ops')) {
        obj['key_ops'] = ApiClient.convertToType(data['key_ops'], [KeyOperations]);
      }
      if (data.hasOwnProperty('custom_metadata')) {
        obj['custom_metadata'] = ApiClient.convertToType(data['custom_metadata'], {'String': 'String'});
      }
      if (data.hasOwnProperty('transient')) {
        obj['transient'] = ApiClient.convertToType(data['transient'], 'Boolean');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/SobjectDescriptor} private_key
   */
  exports.prototype['private_key'] = undefined;
  /**
   * @member {module:model/SobjectDescriptor} public_key
   */
  exports.prototype['public_key'] = undefined;
  /**
   * Name of the agreed-upon key. Key names must be unique within an account. The name is ignored for transient keys and should be the empty string.
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Group ID (not name) of the security group that this security object should belong to. The user or application creating this security object must be a member of this group. If no group is specified, the default group for the user or application will be used. 
   * @member {String} group_id
   */
  exports.prototype['group_id'] = undefined;
  /**
   * Key size of the derived key in bits (not bytes).
   * @member {Number} key_size
   */
  exports.prototype['key_size'] = undefined;
  /**
   * @member {module:model/ObjectType} key_type
   */
  exports.prototype['key_type'] = undefined;
  /**
   * @member {module:model/AgreeKeyMechanism} mechanism
   */
  exports.prototype['mechanism'] = undefined;
  /**
   * Whether the derived key should have cryptographic operations enabled.
   * @member {Boolean} enabled
   */
  exports.prototype['enabled'] = undefined;
  /**
   * Description for the new key.
   * @member {String} description
   */
  exports.prototype['description'] = undefined;
  /**
   * Optional array of key operations to be enabled for this security object. If this property is not provided, the SDKMS server will provide a default set of key operations. Note that if you provide an empty array, all key operations will be disabled. 
   * @member {Array.<module:model/KeyOperations>} key_ops
   */
  exports.prototype['key_ops'] = undefined;
  /**
   * User-defined metadata for this key. Stored as key-value pairs.
   * @member {Object.<String, String>} custom_metadata
   */
  exports.prototype['custom_metadata'] = undefined;
  /**
   * If this is true, SDKMS will derive a transient key.
   * @member {Boolean} transient
   */
  exports.prototype['transient'] = undefined;



  return exports;
}));

