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
    define(['ApiClient', 'model/GoogleServiceAccountKey'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./GoogleServiceAccountKey'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.StackdriverLoggingConfigRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.GoogleServiceAccountKey);
  }
}(this, function(ApiClient, GoogleServiceAccountKey) {
  'use strict';




  /**
   * The StackdriverLoggingConfigRequest model module.
   * @module model/StackdriverLoggingConfigRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>StackdriverLoggingConfigRequest</code>.
   * @alias module:model/StackdriverLoggingConfigRequest
   * @class
   */
  var exports = function() {
    var _this = this;




  };

  /**
   * Constructs a <code>StackdriverLoggingConfigRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/StackdriverLoggingConfigRequest} obj Optional instance to populate.
   * @return {module:model/StackdriverLoggingConfigRequest} The populated <code>StackdriverLoggingConfigRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('log_id')) {
        obj['log_id'] = ApiClient.convertToType(data['log_id'], 'String');
      }
      if (data.hasOwnProperty('service_account_key')) {
        obj['service_account_key'] = GoogleServiceAccountKey.constructFromObject(data['service_account_key']);
      }
      if (data.hasOwnProperty('enabled')) {
        obj['enabled'] = ApiClient.convertToType(data['enabled'], 'Boolean');
      }
    }
    return obj;
  }

  /**
   * The log ID that will recieve the log items (see https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry).
   * @member {String} log_id
   */
  exports.prototype['log_id'] = undefined;
  /**
   * @member {module:model/GoogleServiceAccountKey} service_account_key
   */
  exports.prototype['service_account_key'] = undefined;
  /**
   * @member {Boolean} enabled
   */
  exports.prototype['enabled'] = undefined;



  return exports;
}));


