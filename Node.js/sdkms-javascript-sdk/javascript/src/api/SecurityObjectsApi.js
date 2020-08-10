

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
    define(['ApiClient', 'model/AgreeKeyRequest', 'model/DeriveKeyRequest', 'model/DeriveKeyRequestEx', 'model/DigestResponse', 'model/Error', 'model/KeyObject', 'model/ObjectDigestRequest', 'model/PersistTransientKeyRequest', 'model/SobjectDescriptor', 'model/SobjectRequest'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/AgreeKeyRequest'), require('../model/DeriveKeyRequest'), require('../model/DeriveKeyRequestEx'), require('../model/DigestResponse'), require('../model/Error'), require('../model/KeyObject'), require('../model/ObjectDigestRequest'), require('../model/PersistTransientKeyRequest'), require('../model/SobjectDescriptor'), require('../model/SobjectRequest'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.SecurityObjectsApi = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.AgreeKeyRequest, root.FortanixSdkmsRestApi.DeriveKeyRequest, root.FortanixSdkmsRestApi.DeriveKeyRequestEx, root.FortanixSdkmsRestApi.DigestResponse, root.FortanixSdkmsRestApi.Error, root.FortanixSdkmsRestApi.KeyObject, root.FortanixSdkmsRestApi.ObjectDigestRequest, root.FortanixSdkmsRestApi.PersistTransientKeyRequest, root.FortanixSdkmsRestApi.SobjectDescriptor, root.FortanixSdkmsRestApi.SobjectRequest);
  }
}(this, function(ApiClient, AgreeKeyRequest, DeriveKeyRequest, DeriveKeyRequestEx, DigestResponse, Error, KeyObject, ObjectDigestRequest, PersistTransientKeyRequest, SobjectDescriptor, SobjectRequest) {
  'use strict';

  /**
   * SecurityObjects service.
   * @module api/SecurityObjectsApi
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new SecurityObjectsApi. 
   * @alias module:api/SecurityObjectsApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the agreeKey operation.
     * @callback module:api/SecurityObjectsApi~agreeKeyCallback
     * @param {String} error Error message, if any.
     * @param {module:model/KeyObject} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Agree on a key from two other keys
     * This does a cryptographic key agreement operation between a public and private key. Both keys must have been generated from the same parameters (e.g. the same elliptic curve). Both keys must allow the AGREEKEY operation. The request body contains the requested properties for the new key as well as the mechanism (e.g. Diffie-Hellman) to be used to produce the key material for the new key. The output of this API should not be used directly as a cryptographic key. The target object type should be HMAC or Secret, and a key derivation procedure should be used to derive the actual key material. 
     * @param {module:model/AgreeKeyRequest} body Template of the agreed-upon security object
     * @param {module:api/SecurityObjectsApi~agreeKeyCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/KeyObject}
     */
    this.agreeKey = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling agreeKey");
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
      var returnType = KeyObject;

      return this.apiClient.callApi(
        '/crypto/v1/agree', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deletePrivateKey operation.
     * @callback module:api/SecurityObjectsApi~deletePrivateKeyCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Remove / Destroy private half of the asymmetric key
     * Removes the private portion of an asymmetric key from SDKMS. After this operation is performed, operations that require the private key, such as encryption and generating signatures, may no longer be performed. 
     * @param {String} keyId kid of security object
     * @param {module:api/SecurityObjectsApi~deletePrivateKeyCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.deletePrivateKey = function(keyId, callback) {
      var postBody = null;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling deletePrivateKey");
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
      var returnType = null;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}/private', 'DELETE',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deleteSecurityObject operation.
     * @callback module:api/SecurityObjectsApi~deleteSecurityObjectCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete a security object
     * Delete a specified security object.
     * @param {String} keyId kid of security object
     * @param {module:api/SecurityObjectsApi~deleteSecurityObjectCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.deleteSecurityObject = function(keyId, callback) {
      var postBody = null;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling deleteSecurityObject");
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
      var returnType = null;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}', 'DELETE',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deriveKey operation.
     * @callback module:api/SecurityObjectsApi~deriveKeyCallback
     * @param {String} error Error message, if any.
     * @param {module:model/KeyObject} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Derive a key from another key
     * This derives a key from an existing key and returns the properties of the new key. The request body contains the requested properties for the new as well as the mechanism to be used to produce the key material for the new key. 
     * @param {String} keyId kid of security object
     * @param {module:model/DeriveKeyRequest} body Name of security object
     * @param {module:api/SecurityObjectsApi~deriveKeyCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/KeyObject}
     */
    this.deriveKey = function(keyId, body, callback) {
      var postBody = body;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling deriveKey");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling deriveKey");
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
      var returnType = KeyObject;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}/derive', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deriveKeyEx operation.
     * @callback module:api/SecurityObjectsApi~deriveKeyExCallback
     * @param {String} error Error message, if any.
     * @param {module:model/KeyObject} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Derive a key from another key
     * This derives a key from an existing key and returns the properties of the new key. The request body contains the requested properties for the new as well as the mechanism to be used to produce the key material for the new key. 
     * @param {module:model/DeriveKeyRequestEx} body Name of security object
     * @param {module:api/SecurityObjectsApi~deriveKeyExCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/KeyObject}
     */
    this.deriveKeyEx = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling deriveKeyEx");
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
      var returnType = KeyObject;

      return this.apiClient.callApi(
        '/crypto/v1/derive', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the generateSecurityObject operation.
     * @callback module:api/SecurityObjectsApi~generateSecurityObjectCallback
     * @param {String} error Error message, if any.
     * @param {module:model/KeyObject} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Generate a new security object
     * Generate a new security object (such as an RSA key pair or an AES key) of the requested size or elliptic curve. &lt;br&gt; By default, all key operations except for Export that are implemented for that type of key will be enabled. These may be overridden by requesting specific operations in the key creation request. &lt;br&gt; Objects of type Opaque may not be generated with this API. They must be imported via the importSecurityObject API. 
     * @param {module:model/SobjectRequest} body Request to create, update, or import security object
     * @param {module:api/SecurityObjectsApi~generateSecurityObjectCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/KeyObject}
     */
    this.generateSecurityObject = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling generateSecurityObject");
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
      var returnType = KeyObject;

      return this.apiClient.callApi(
        '/crypto/v1/keys', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getSecurityObject operation.
     * @callback module:api/SecurityObjectsApi~getSecurityObjectCallback
     * @param {String} error Error message, if any.
     * @param {module:model/KeyObject} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get a specific security object
     * Get the details of a particular security object. The query parameter &#x60;?view&#x3D;value&#x60; may be used to get the value of an opaque object or certificate directly as raw bytes. 
     * @param {String} keyId kid of security object
     * @param {module:api/SecurityObjectsApi~getSecurityObjectCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/KeyObject}
     */
    this.getSecurityObject = function(keyId, callback) {
      var postBody = null;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling getSecurityObject");
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
      var returnType = KeyObject;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getSecurityObjectDigest operation.
     * @callback module:api/SecurityObjectsApi~getSecurityObjectDigestCallback
     * @param {String} error Error message, if any.
     * @param {module:model/DigestResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Retrieve the digest (hash) of the value of an exportable security object
     * @param {module:model/ObjectDigestRequest} body Object digest request
     * @param {module:api/SecurityObjectsApi~getSecurityObjectDigestCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/DigestResponse}
     */
    this.getSecurityObjectDigest = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling getSecurityObjectDigest");
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
      var returnType = DigestResponse;

      return this.apiClient.callApi(
        '/crypto/v1/keys/digest', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getSecurityObjectValue operation.
     * @callback module:api/SecurityObjectsApi~getSecurityObjectValueCallback
     * @param {String} error Error message, if any.
     * @param {module:model/KeyObject} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Retrieve the value of an exportable security object
     * Get the details and value of a particular exportable security object. 
     * @param {String} keyId kid of security object
     * @param {module:api/SecurityObjectsApi~getSecurityObjectValueCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/KeyObject}
     */
    this.getSecurityObjectValue = function(keyId, callback) {
      var postBody = null;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling getSecurityObjectValue");
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
      var returnType = KeyObject;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}/export', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getSecurityObjectValueEx operation.
     * @callback module:api/SecurityObjectsApi~getSecurityObjectValueExCallback
     * @param {String} error Error message, if any.
     * @param {module:model/KeyObject} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Retrieve the value of an exportable security object
     * Get the details and value of a particular exportable security object. 
     * @param {module:model/SobjectDescriptor} body Request to export a security object
     * @param {module:api/SecurityObjectsApi~getSecurityObjectValueExCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/KeyObject}
     */
    this.getSecurityObjectValueEx = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling getSecurityObjectValueEx");
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
      var returnType = KeyObject;

      return this.apiClient.callApi(
        '/crypto/v1/keys/export', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getSecurityObjects operation.
     * @callback module:api/SecurityObjectsApi~getSecurityObjectsCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/KeyObject>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get all security objects
     * Return detailed information about the security objects stored in Fortanix SDKMS. 
     * @param {Object} opts Optional parameters
     * @param {String} opts.name Only retrieve the security object with this name.
     * @param {String} opts.groupId Only retrieve security objects in the specified group.
     * @param {String} opts.creator Only retrieve security objects created by the user or application with the specified id.
     * @param {String} opts.sort This specifies the property (&#x60;kid&#x60; or &#x60;name&#x60;) and order (ascending or descending) with which to sort the security objects. By default, security objects are sorted by &#x60;kid&#x60; in ascending order. The syntax is \&quot;&lt;property&gt;:[asc|desc]\&quot; (e.g. \&quot;kid:desc\&quot;) or just \&quot;&lt;property&gt;\&quot; (ascending order by default). 
     * @param {String} opts.start If provided, this must be a value of the property specified in &#x60;sort&#x60;. Returned security objects will begin just above or just below this value (for asc/desc order resp.). 
     * @param {Number} opts.limit Maximum number of security objects to return. If not provided, the limit is 100.
     * @param {Number} opts.offset Number of security objects past &#x60;start&#x60; to skip.
     * @param {module:api/SecurityObjectsApi~getSecurityObjectsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/KeyObject>}
     */
    this.getSecurityObjects = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'name': opts['name'],
        'group_id': opts['groupId'],
        'creator': opts['creator'],
        'sort': opts['sort'],
        'start': opts['start'],
        'limit': opts['limit'],
        'offset': opts['offset'],
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
      var returnType = [KeyObject];

      return this.apiClient.callApi(
        '/crypto/v1/keys', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the importSecurityObject operation.
     * @callback module:api/SecurityObjectsApi~importSecurityObjectCallback
     * @param {String} error Error message, if any.
     * @param {module:model/KeyObject} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Import a security object
     * Import a security object into SDKMS. &lt;br&gt; By default, all key operations except that are implemented for that type of key will be enabled. These may be overridden by requesting specific operations in the key import request. &lt;br&gt; For symmetric and asymmetric keys, value is base64-encoding of the key material in DER format. 
     * @param {module:model/SobjectRequest} body Request to create, update, or import security object
     * @param {module:api/SecurityObjectsApi~importSecurityObjectCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/KeyObject}
     */
    this.importSecurityObject = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling importSecurityObject");
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
      var returnType = KeyObject;

      return this.apiClient.callApi(
        '/crypto/v1/keys', 'PUT',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the persistSecurityObject operation.
     * @callback module:api/SecurityObjectsApi~persistSecurityObjectCallback
     * @param {String} error Error message, if any.
     * @param {module:model/KeyObject} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Persist a transient key.
     * This API copies a transient key into a persisted security object in SDKMS. If the transient key&#39;s origin is \&quot;FortanixHSM\&quot;, the origin of the persisted key will be \&quot;Transient\&quot;. If the transient key&#39;s origin is \&quot;External\&quot;, the origin of the persisted key will be \&quot;External\&quot;. 
     * @param {module:model/PersistTransientKeyRequest} body Persist transient key request
     * @param {module:api/SecurityObjectsApi~persistSecurityObjectCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/KeyObject}
     */
    this.persistSecurityObject = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling persistSecurityObject");
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
      var returnType = KeyObject;

      return this.apiClient.callApi(
        '/crypto/v1/keys/persist', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the updateSecurityObject operation.
     * @callback module:api/SecurityObjectsApi~updateSecurityObjectCallback
     * @param {String} error Error message, if any.
     * @param {module:model/KeyObject} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Update a security object
     * Update the properties of a security object. 
     * @param {String} keyId kid of security object
     * @param {module:model/SobjectRequest} body Request to create, update, or import security object
     * @param {module:api/SecurityObjectsApi~updateSecurityObjectCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/KeyObject}
     */
    this.updateSecurityObject = function(keyId, body, callback) {
      var postBody = body;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling updateSecurityObject");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling updateSecurityObject");
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
      var returnType = KeyObject;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}', 'PATCH',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));