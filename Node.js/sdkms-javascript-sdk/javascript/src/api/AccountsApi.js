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
    define(['ApiClient', 'model/Account', 'model/AccountRequest', 'model/Error'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/Account'), require('../model/AccountRequest'), require('../model/Error'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.AccountsApi = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.Account, root.FortanixSdkmsRestApi.AccountRequest, root.FortanixSdkmsRestApi.Error);
  }
}(this, function(ApiClient, Account, AccountRequest, Error) {
  'use strict';

  /**
   * Accounts service.
   * @module api/AccountsApi
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new AccountsApi. 
   * @alias module:api/AccountsApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the createAccount operation.
     * @callback module:api/AccountsApi~createAccountCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Account} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Create a new account
     * Create a new account with the specified properties.
     * @param {module:model/AccountRequest} body Properties to assign to Account.
     * @param {module:api/AccountsApi~createAccountCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Account}
     */
    this.createAccount = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling createAccount");
      }


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
      var returnType = Account;

      return this.apiClient.callApi(
        '/sys/v1/accounts', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deleteAccount operation.
     * @callback module:api/AccountsApi~deleteAccountCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete account
     * Remove an account from SDKMS.
     * @param {String} accountId Account Identifier
     * @param {module:api/AccountsApi~deleteAccountCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.deleteAccount = function(accountId, callback) {
      var postBody = null;

      // verify the required parameter 'accountId' is set
      if (accountId === undefined || accountId === null) {
        throw new Error("Missing the required parameter 'accountId' when calling deleteAccount");
      }


      var pathParams = {
        'account-id': accountId
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
        '/sys/v1/accounts/{account-id}', 'DELETE',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getAccount operation.
     * @callback module:api/AccountsApi~getAccountCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Account} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get a specific account
     * Look up an account by account ID.
     * @param {String} accountId Account Identifier
     * @param {module:api/AccountsApi~getAccountCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Account}
     */
    this.getAccount = function(accountId, callback) {
      var postBody = null;

      // verify the required parameter 'accountId' is set
      if (accountId === undefined || accountId === null) {
        throw new Error("Missing the required parameter 'accountId' when calling getAccount");
      }


      var pathParams = {
        'account-id': accountId
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
      var returnType = Account;

      return this.apiClient.callApi(
        '/sys/v1/accounts/{account-id}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getAccounts operation.
     * @callback module:api/AccountsApi~getAccountsCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Account>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get all accounts
     * Get detailed information on all accounts the current user has access to.
     * @param {module:api/AccountsApi~getAccountsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Account>}
     */
    this.getAccounts = function(callback) {
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
      var returnType = [Account];

      return this.apiClient.callApi(
        '/sys/v1/accounts', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the updateAccount operation.
     * @callback module:api/AccountsApi~updateAccountCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Account} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Update account
     * Update the properties of an account. Only certain properties may be changed with this API. 
     * @param {String} accountId Account Identifier
     * @param {module:model/AccountRequest} body Properties to assign to Account.
     * @param {module:api/AccountsApi~updateAccountCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Account}
     */
    this.updateAccount = function(accountId, body, callback) {
      var postBody = body;

      // verify the required parameter 'accountId' is set
      if (accountId === undefined || accountId === null) {
        throw new Error("Missing the required parameter 'accountId' when calling updateAccount");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling updateAccount");
      }


      var pathParams = {
        'account-id': accountId
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
      var returnType = Account;

      return this.apiClient.callApi(
        '/sys/v1/accounts/{account-id}', 'PATCH',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));
