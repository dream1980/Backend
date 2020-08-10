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
    define(['ApiClient', 'model/U2fDevice', 'model/UserAccountFlags', 'model/UserAccountMap', 'model/UserState'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./U2fDevice'), require('./UserAccountFlags'), require('./UserAccountMap'), require('./UserState'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.User = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.U2fDevice, root.FortanixSdkmsRestApi.UserAccountFlags, root.FortanixSdkmsRestApi.UserAccountMap, root.FortanixSdkmsRestApi.UserState);
  }
}(this, function(ApiClient, U2fDevice, UserAccountFlags, UserAccountMap, UserState) {
  'use strict';




  /**
   * The User model module.
   * @module model/User
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>User</code>.
   * @alias module:model/User
   * @class
   * @param userId {String} User ID uniquely identifying this user.
   * @param userEmail {String} The User's email address.
   * @param state {module:model/UserState} 
   * @param groups {module:model/UserAccountMap} 
   * @param enabled {Boolean} Whether this user's account is enabled.
   * @param emailVerified {Boolean} Whether this user's email has been verified.
   * @param createdAt {String} When this user was added to SDKMS.
   * @param u2fDevices {Array.<module:model/U2fDevice>} 
   */
  var exports = function(userId, userEmail, state, groups, enabled, emailVerified, createdAt, u2fDevices) {
    var _this = this;

    _this['user_id'] = userId;
    _this['user_email'] = userEmail;
    _this['state'] = state;

    _this['groups'] = groups;
    _this['enabled'] = enabled;
    _this['email_verified'] = emailVerified;
    _this['created_at'] = createdAt;

    _this['u2f_devices'] = u2fDevices;
  };

  /**
   * Constructs a <code>User</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/User} obj Optional instance to populate.
   * @return {module:model/User} The populated <code>User</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('user_id')) {
        obj['user_id'] = ApiClient.convertToType(data['user_id'], 'String');
      }
      if (data.hasOwnProperty('user_email')) {
        obj['user_email'] = ApiClient.convertToType(data['user_email'], 'String');
      }
      if (data.hasOwnProperty('state')) {
        obj['state'] = UserState.constructFromObject(data['state']);
      }
      if (data.hasOwnProperty('account_role')) {
        obj['account_role'] = ApiClient.convertToType(data['account_role'], [UserAccountFlags]);
      }
      if (data.hasOwnProperty('groups')) {
        obj['groups'] = UserAccountMap.constructFromObject(data['groups']);
      }
      if (data.hasOwnProperty('enabled')) {
        obj['enabled'] = ApiClient.convertToType(data['enabled'], 'Boolean');
      }
      if (data.hasOwnProperty('email_verified')) {
        obj['email_verified'] = ApiClient.convertToType(data['email_verified'], 'Boolean');
      }
      if (data.hasOwnProperty('created_at')) {
        obj['created_at'] = ApiClient.convertToType(data['created_at'], 'String');
      }
      if (data.hasOwnProperty('last_logged_in_at')) {
        obj['last_logged_in_at'] = ApiClient.convertToType(data['last_logged_in_at'], 'String');
      }
      if (data.hasOwnProperty('u2f_devices')) {
        obj['u2f_devices'] = ApiClient.convertToType(data['u2f_devices'], [U2fDevice]);
      }
    }
    return obj;
  }

  /**
   * User ID uniquely identifying this user.
   * @member {String} user_id
   */
  exports.prototype['user_id'] = undefined;
  /**
   * The User's email address.
   * @member {String} user_email
   */
  exports.prototype['user_email'] = undefined;
  /**
   * @member {module:model/UserState} state
   */
  exports.prototype['state'] = undefined;
  /**
   * @member {Array.<module:model/UserAccountFlags>} account_role
   */
  exports.prototype['account_role'] = undefined;
  /**
   * @member {module:model/UserAccountMap} groups
   */
  exports.prototype['groups'] = undefined;
  /**
   * Whether this user's account is enabled.
   * @member {Boolean} enabled
   */
  exports.prototype['enabled'] = undefined;
  /**
   * Whether this user's email has been verified.
   * @member {Boolean} email_verified
   */
  exports.prototype['email_verified'] = undefined;
  /**
   * When this user was added to SDKMS.
   * @member {String} created_at
   */
  exports.prototype['created_at'] = undefined;
  /**
   * When this user last logged in.
   * @member {String} last_logged_in_at
   */
  exports.prototype['last_logged_in_at'] = undefined;
  /**
   * @member {Array.<module:model/U2fDevice>} u2f_devices
   */
  exports.prototype['u2f_devices'] = undefined;



  return exports;
}));

