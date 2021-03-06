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
    define(['ApiClient', 'model/BatchSignRequest', 'model/BatchSignResponse', 'model/BatchVerifyRequest', 'model/BatchVerifyResponse', 'model/Error', 'model/SignRequest', 'model/SignRequestEx', 'model/SignResponse', 'model/VerifyRequest', 'model/VerifyRequestEx', 'model/VerifyResponse'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/BatchSignRequest'), require('../model/BatchSignResponse'), require('../model/BatchVerifyRequest'), require('../model/BatchVerifyResponse'), require('../model/Error'), require('../model/SignRequest'), require('../model/SignRequestEx'), require('../model/SignResponse'), require('../model/VerifyRequest'), require('../model/VerifyRequestEx'), require('../model/VerifyResponse'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.SignAndVerifyApi = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.BatchSignRequest, root.FortanixSdkmsRestApi.BatchSignResponse, root.FortanixSdkmsRestApi.BatchVerifyRequest, root.FortanixSdkmsRestApi.BatchVerifyResponse, root.FortanixSdkmsRestApi.Error, root.FortanixSdkmsRestApi.SignRequest, root.FortanixSdkmsRestApi.SignRequestEx, root.FortanixSdkmsRestApi.SignResponse, root.FortanixSdkmsRestApi.VerifyRequest, root.FortanixSdkmsRestApi.VerifyRequestEx, root.FortanixSdkmsRestApi.VerifyResponse);
  }
}(this, function(ApiClient, BatchSignRequest, BatchSignResponse, BatchVerifyRequest, BatchVerifyResponse, Error, SignRequest, SignRequestEx, SignResponse, VerifyRequest, VerifyRequestEx, VerifyResponse) {
  'use strict';

  /**
   * SignAndVerify service.
   * @module api/SignAndVerifyApi
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new SignAndVerifyApi. 
   * @alias module:api/SignAndVerifyApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the batchSign operation.
     * @callback module:api/SignAndVerifyApi~batchSignCallback
     * @param {String} error Error message, if any.
     * @param {module:model/BatchSignResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Batch sign with one or more private keys
     * The data to be signed and the key ids to be used are provided in the request body. The signature is returned in the response body. The ordering of the body matches the ordering of the request. An individual status code is returned for each batch item. Maximum size of the entire batch request is 512 KB. 
     * @param {module:model/BatchSignRequest} body Batch Sign request
     * @param {module:api/SignAndVerifyApi~batchSignCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/BatchSignResponse}
     */
    this.batchSign = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling batchSign");
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
      var returnType = BatchSignResponse;

      return this.apiClient.callApi(
        '/crypto/v1/keys/batch/sign', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the batchVerify operation.
     * @callback module:api/SignAndVerifyApi~batchVerifyCallback
     * @param {String} error Error message, if any.
     * @param {module:model/BatchVerifyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Batch verify with one or more private keys
     * The signature to be verified and the key ids to be used are provided in the request body. The result (true of false) returned in the response body. The ordering of the body matches the ordering of the request. An individual status code is returned for each batch item. Maximum size of the entire batch request is 512 KB. 
     * @param {module:model/BatchVerifyRequest} body Batch Verify request
     * @param {module:api/SignAndVerifyApi~batchVerifyCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/BatchVerifyResponse}
     */
    this.batchVerify = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling batchVerify");
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
      var returnType = BatchVerifyResponse;

      return this.apiClient.callApi(
        '/crypto/v1/keys/batch/verify', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the sign operation.
     * @callback module:api/SignAndVerifyApi~signCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SignResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Sign with a private key
     * Sign data with a private key. The signing key must be an asymmetric key with the private part present. The sign operation must be enabled for this key. Symmetric keys  may not be used to sign data. They can be used with the computeMac and verifyMac methods. &lt;br&gt; The data must be hashed with a SHA-1 or SHA-2 family hash algorithm. 
     * @param {String} keyId kid of security object
     * @param {module:model/SignRequest} body Signature request
     * @param {module:api/SignAndVerifyApi~signCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SignResponse}
     */
    this.sign = function(keyId, body, callback) {
      var postBody = body;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling sign");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling sign");
      }


      var pathParams = {
        'key-id': keyId
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
      var returnType = SignResponse;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}/sign', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the signEx operation.
     * @callback module:api/SignAndVerifyApi~signExCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SignResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Sign with a private key
     * Sign data with a private key. The signing key must be an asymmetric key with the private part present. The sign operation must be enabled for this key. Symmetric keys  may not be used to sign data. They can be used with the computeMac and verifyMac methods. &lt;br&gt; The data must be hashed with a SHA-1 or SHA-2 family hash algorithm. 
     * @param {module:model/SignRequestEx} body Signature request
     * @param {module:api/SignAndVerifyApi~signExCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SignResponse}
     */
    this.signEx = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling signEx");
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
      var returnType = SignResponse;

      return this.apiClient.callApi(
        '/crypto/v1/sign', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the verify operation.
     * @callback module:api/SignAndVerifyApi~verifyCallback
     * @param {String} error Error message, if any.
     * @param {module:model/VerifyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Verify a signature with a key
     * Verify a signature with a public key. The verifying key must be an asymmetric key with the verify operation enabled. Symmetric keys may not be used to verify data. They can be used with the computeMac and verifyMac operations. &lt;br&gt; The signature must have been created with a SHA-1 or SHA-2 family hash algorithm. 
     * @param {String} keyId kid of security object
     * @param {module:model/VerifyRequest} body Verification request
     * @param {module:api/SignAndVerifyApi~verifyCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/VerifyResponse}
     */
    this.verify = function(keyId, body, callback) {
      var postBody = body;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling verify");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling verify");
      }


      var pathParams = {
        'key-id': keyId
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
      var returnType = VerifyResponse;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}/verify', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the verifyEx operation.
     * @callback module:api/SignAndVerifyApi~verifyExCallback
     * @param {String} error Error message, if any.
     * @param {module:model/VerifyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Verify a signature with a key
     * Verify a signature with a public key. The verifying key must be an asymmetric key with the verify operation enabled. Symmetric keys may not be used to verify data. They can be used with the computeMac and verifyMac operations. &lt;br&gt; The signature must have been created with a SHA-1 or SHA-2 family hash algorithm. 
     * @param {module:model/VerifyRequestEx} body Verification request
     * @param {module:api/SignAndVerifyApi~verifyExCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/VerifyResponse}
     */
    this.verifyEx = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling verifyEx");
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
      var returnType = VerifyResponse;

      return this.apiClient.callApi(
        '/crypto/v1/verify', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));
