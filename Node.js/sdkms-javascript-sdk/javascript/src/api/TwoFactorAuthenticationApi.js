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
    define(['ApiClient', 'model/Error', 'model/MfaChallenge', 'model/RecoveryCodes'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/Error'), require('../model/MfaChallenge'), require('../model/RecoveryCodes'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.TwoFactorAuthenticationApi = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.Error, root.FortanixSdkmsRestApi.MfaChallenge, root.FortanixSdkmsRestApi.RecoveryCodes);
  }
}(this, function(ApiClient, Error, MfaChallenge, RecoveryCodes) {
  'use strict';

  /**
   * TwoFactorAuthentication service.
   * @module api/TwoFactorAuthenticationApi
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new TwoFactorAuthenticationApi. 
   * @alias module:api/TwoFactorAuthenticationApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the authorizeRecoveryCode operation.
     * @callback module:api/TwoFactorAuthenticationApi~authorizeRecoveryCodeCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Use a backup recovery code to complete authentication
     * Complete two factor authentication with a backup recovery code. The caller needs to provide a bearer token for the session in the request body. Each recovery code may only be used once, so users should update their two factor configuration after using this API. 
     * @param {module:api/TwoFactorAuthenticationApi~authorizeRecoveryCodeCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.authorizeRecoveryCode = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/sys/v1/session/auth/2fa/recovery_code', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the authorizeU2F operation.
     * @callback module:api/TwoFactorAuthenticationApi~authorizeU2FCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Use a U2F key to complete authentication
     * Complete two factor authentication with a U2F authentication token to authenticate to SDKMS. The response body contains a bearer authentication token which needs to be provided by subsequent calls for the duration of the session. 
     * @param {module:api/TwoFactorAuthenticationApi~authorizeU2FCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.authorizeU2F = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['basicAuth'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/sys/v1/session/auth/2fa/u2f', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the generateRecoveryCodes operation.
     * @callback module:api/TwoFactorAuthenticationApi~generateRecoveryCodesCallback
     * @param {String} error Error message, if any.
     * @param {module:model/RecoveryCodes} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Generate backup recovery codes for the current user
     * Generate backup recovery codes that may be used to complete complete two factor authentication. The caller needs to provide a bearer token for the session in the request body. Two factor configuration must be unlocked to use this API. 
     * @param {module:api/TwoFactorAuthenticationApi~generateRecoveryCodesCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/RecoveryCodes}
     */
    this.generateRecoveryCodes = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = RecoveryCodes;

      return this.apiClient.callApi(
        '/sys/v1/users/generate_recovery_code', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the generateU2FChallenge operation.
     * @callback module:api/TwoFactorAuthenticationApi~generateU2FChallengeCallback
     * @param {String} error Error message, if any.
     * @param {module:model/MfaChallenge} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Generate a new challenge for registering a U2F devices
     * Generate a new challenge that may be used to register U2F devices. The caller needs to provide a bearer token for the session in the request body. 
     * @param {module:api/TwoFactorAuthenticationApi~generateU2FChallengeCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/MfaChallenge}
     */
    this.generateU2FChallenge = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = MfaChallenge;

      return this.apiClient.callApi(
        '/sys/v1/session/config_2fa/new_challenge', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the lock2F operation.
     * @callback module:api/TwoFactorAuthenticationApi~lock2FCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Lock two factor configuration
     * Lock two factor configuration after completing two factor reconfiguration. The caller needs to provide a bearer token for the session in the request body. If this API is not called, two factor configuration will be locked automatically after ten minutes. 
     * @param {module:api/TwoFactorAuthenticationApi~lock2FCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.lock2F = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/sys/v1/session/config_2fa/terminate', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));