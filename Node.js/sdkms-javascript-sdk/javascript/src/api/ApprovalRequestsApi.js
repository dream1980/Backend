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
    define(['ApiClient', 'model/ApprovableResult', 'model/ApprovalRequest', 'model/ApprovalRequestRequest', 'model/Error'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/ApprovableResult'), require('../model/ApprovalRequest'), require('../model/ApprovalRequestRequest'), require('../model/Error'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.ApprovalRequestsApi = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.ApprovableResult, root.FortanixSdkmsRestApi.ApprovalRequest, root.FortanixSdkmsRestApi.ApprovalRequestRequest, root.FortanixSdkmsRestApi.Error);
  }
}(this, function(ApiClient, ApprovableResult, ApprovalRequest, ApprovalRequestRequest, Error) {
  'use strict';

  /**
   * ApprovalRequests service.
   * @module api/ApprovalRequestsApi
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new ApprovalRequestsApi. 
   * @alias module:api/ApprovalRequestsApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the approve operation.
     * @callback module:api/ApprovalRequestsApi~approveCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Approve a request.
     * @param {String} requestId Approval Request Identifier
     * @param {module:api/ApprovalRequestsApi~approveCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.approve = function(requestId, callback) {
      var postBody = null;

      // verify the required parameter 'requestId' is set
      if (requestId === undefined || requestId === null) {
        throw new Error("Missing the required parameter 'requestId' when calling approve");
      }


      var pathParams = {
        'request-id': requestId
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
        '/sys/v1/approval_requests/{request-id}/approve', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the createApprovalRequest operation.
     * @callback module:api/ApprovalRequestsApi~createApprovalRequestCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ApprovalRequest} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Create approval request
     * @param {module:model/ApprovalRequestRequest} body Request to create an approval request.
     * @param {module:api/ApprovalRequestsApi~createApprovalRequestCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/ApprovalRequest}
     */
    this.createApprovalRequest = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling createApprovalRequest");
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
      var returnType = ApprovalRequest;

      return this.apiClient.callApi(
        '/sys/v1/approval_requests', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deleteApprovalRequest operation.
     * @callback module:api/ApprovalRequestsApi~deleteApprovalRequestCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete an approval request.
     * @param {String} requestId Approval Request Identifier
     * @param {module:api/ApprovalRequestsApi~deleteApprovalRequestCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.deleteApprovalRequest = function(requestId, callback) {
      var postBody = null;

      // verify the required parameter 'requestId' is set
      if (requestId === undefined || requestId === null) {
        throw new Error("Missing the required parameter 'requestId' when calling deleteApprovalRequest");
      }


      var pathParams = {
        'request-id': requestId
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
        '/sys/v1/approval_requests/{request-id}', 'DELETE',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deny operation.
     * @callback module:api/ApprovalRequestsApi~denyCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Deny a request.
     * @param {String} requestId Approval Request Identifier
     * @param {module:api/ApprovalRequestsApi~denyCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.deny = function(requestId, callback) {
      var postBody = null;

      // verify the required parameter 'requestId' is set
      if (requestId === undefined || requestId === null) {
        throw new Error("Missing the required parameter 'requestId' when calling deny");
      }


      var pathParams = {
        'request-id': requestId
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
        '/sys/v1/approval_requests/{request-id}/deny', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getApprovalRequest operation.
     * @callback module:api/ApprovalRequestsApi~getApprovalRequestCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ApprovalRequest} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get an approval request.
     * Get the details and status of a particular approval request.
     * @param {String} requestId Approval Request Identifier
     * @param {module:api/ApprovalRequestsApi~getApprovalRequestCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/ApprovalRequest}
     */
    this.getApprovalRequest = function(requestId, callback) {
      var postBody = null;

      // verify the required parameter 'requestId' is set
      if (requestId === undefined || requestId === null) {
        throw new Error("Missing the required parameter 'requestId' when calling getApprovalRequest");
      }


      var pathParams = {
        'request-id': requestId
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
      var returnType = ApprovalRequest;

      return this.apiClient.callApi(
        '/sys/v1/approval_requests/{request-id}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getApprovalRequests operation.
     * @callback module:api/ApprovalRequestsApi~getApprovalRequestsCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/ApprovalRequest>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get all approval requests
     * @param {Object} opts Optional parameters
     * @param {String} opts.requester Only retrieve approval requests with the specified requester ID
     * @param {String} opts.reviewer Only retrieve approval requests with the specified reviewer ID
     * @param {String} opts.subject Only retrieve approval requests with the specified subject ID
     * @param {module:model/String} opts.status Only retrieve approval requests with the specified approval status
     * @param {module:api/ApprovalRequestsApi~getApprovalRequestsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/ApprovalRequest>}
     */
    this.getApprovalRequests = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'requester': opts['requester'],
        'reviewer': opts['reviewer'],
        'subject': opts['subject'],
        'status': opts['status'],
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
      var returnType = [ApprovalRequest];

      return this.apiClient.callApi(
        '/sys/v1/approval_requests', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getResult operation.
     * @callback module:api/ApprovalRequestsApi~getResultCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ApprovableResult} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get the result for an approved or failed request.
     * @param {String} requestId Approval Request Identifier
     * @param {module:api/ApprovalRequestsApi~getResultCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/ApprovableResult}
     */
    this.getResult = function(requestId, callback) {
      var postBody = null;

      // verify the required parameter 'requestId' is set
      if (requestId === undefined || requestId === null) {
        throw new Error("Missing the required parameter 'requestId' when calling getResult");
      }


      var pathParams = {
        'request-id': requestId
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
      var returnType = ApprovableResult;

      return this.apiClient.callApi(
        '/sys/v1/approval_requests/{request-id}/result', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));
