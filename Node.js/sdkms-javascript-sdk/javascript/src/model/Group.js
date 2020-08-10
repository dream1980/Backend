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
    define(['ApiClient', 'model/CreatorType'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./CreatorType'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.Group = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.CreatorType);
  }
}(this, function(ApiClient, CreatorType) {
  'use strict';




  /**
   * The Group model module.
   * @module model/Group
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>Group</code>.
   * @alias module:model/Group
   * @class
   */
  var exports = function() {
    var _this = this;







  };

  /**
   * Constructs a <code>Group</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Group} obj Optional instance to populate.
   * @return {module:model/Group} The populated <code>Group</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('group_id')) {
        obj['group_id'] = ApiClient.convertToType(data['group_id'], 'String');
      }
      if (data.hasOwnProperty('description')) {
        obj['description'] = ApiClient.convertToType(data['description'], 'String');
      }
      if (data.hasOwnProperty('acct_id')) {
        obj['acct_id'] = ApiClient.convertToType(data['acct_id'], 'String');
      }
      if (data.hasOwnProperty('creator')) {
        obj['creator'] = CreatorType.constructFromObject(data['creator']);
      }
      if (data.hasOwnProperty('created_at')) {
        obj['created_at'] = ApiClient.convertToType(data['created_at'], 'String');
      }
    }
    return obj;
  }

  /**
   * Name of the group. Group names must be unique within an account.
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Group ID uniquely identifying this group.
   * @member {String} group_id
   */
  exports.prototype['group_id'] = undefined;
  /**
   * Description of the group.
   * @member {String} description
   */
  exports.prototype['description'] = undefined;
  /**
   * Account ID of the account this Group belongs to.
   * @member {String} acct_id
   */
  exports.prototype['acct_id'] = undefined;
  /**
   * @member {module:model/CreatorType} creator
   */
  exports.prototype['creator'] = undefined;
  /**
   * When this group was created.
   * @member {String} created_at
   */
  exports.prototype['created_at'] = undefined;



  return exports;
}));


