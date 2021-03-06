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
    define(['ApiClient', 'model/App', 'model/Error', 'model/Plugin', 'model/PluginInvokeRequest', 'model/PluginInvokeResponse', 'model/PluginRequest'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/App'), require('../model/Error'), require('../model/Plugin'), require('../model/PluginInvokeRequest'), require('../model/PluginInvokeResponse'), require('../model/PluginRequest'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.PluginsApi = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.App, root.FortanixSdkmsRestApi.Error, root.FortanixSdkmsRestApi.Plugin, root.FortanixSdkmsRestApi.PluginInvokeRequest, root.FortanixSdkmsRestApi.PluginInvokeResponse, root.FortanixSdkmsRestApi.PluginRequest);
  }
}(this, function(ApiClient, App, Error, Plugin, PluginInvokeRequest, PluginInvokeResponse, PluginRequest) {
  'use strict';

  /**
   * Plugins service.
   * @module api/PluginsApi
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new PluginsApi. 
   * @alias module:api/PluginsApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the createPlugin operation.
     * @callback module:api/PluginsApi~createPluginCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Plugin} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Create a new plugin
     * Create a new plugin with the specified properties.
     * @param {module:model/PluginRequest} body Properties of plugin to create
     * @param {module:api/PluginsApi~createPluginCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Plugin}
     */
    this.createPlugin = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling createPlugin");
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
      var returnType = Plugin;

      return this.apiClient.callApi(
        '/sys/v1/plugins', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deletePlugin operation.
     * @callback module:api/PluginsApi~deletePluginCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete plugin
     * Remove a plugin from SDKMS.
     * @param {String} pluginId Plugin Identifier
     * @param {module:api/PluginsApi~deletePluginCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.deletePlugin = function(pluginId, callback) {
      var postBody = null;

      // verify the required parameter 'pluginId' is set
      if (pluginId === undefined || pluginId === null) {
        throw new Error("Missing the required parameter 'pluginId' when calling deletePlugin");
      }


      var pathParams = {
        'plugin-id': pluginId
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
        '/sys/v1/plugins/{plugin-id}', 'DELETE',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getPlugin operation.
     * @callback module:api/PluginsApi~getPluginCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Plugin} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get a specific plugin
     * Look up plugin by plugin ID.
     * @param {String} pluginId Plugin Identifier
     * @param {module:api/PluginsApi~getPluginCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Plugin}
     */
    this.getPlugin = function(pluginId, callback) {
      var postBody = null;

      // verify the required parameter 'pluginId' is set
      if (pluginId === undefined || pluginId === null) {
        throw new Error("Missing the required parameter 'pluginId' when calling getPlugin");
      }


      var pathParams = {
        'plugin-id': pluginId
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
      var returnType = Plugin;

      return this.apiClient.callApi(
        '/sys/v1/plugins/{plugin-id}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getPlugins operation.
     * @callback module:api/PluginsApi~getPluginsCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Plugin>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get all plugins
     * Get details of all plugins the current user has access to.
     * @param {Object} opts Optional parameters
     * @param {String} opts.groupId Only retrieve plugins in the specified group.
     * @param {String} opts.sort This specifies the property (&#x60;plugin_id&#x60; only, for now) and order (ascending or descending) with which to sort the apps. By default, plugins are sorted by &#x60;plugin_id&#x60; in ascending order. The syntax is \&quot;&lt;property&gt;:[asc|desc]\&quot; (e.g. \&quot;plugin_id:desc\&quot;) or just \&quot;&lt;property&gt;\&quot; (ascending order by default). 
     * @param {String} opts.start If provided, this must be a value of the property specified in &#x60;sort&#x60;. Returned apps will begin just above or just below this value (for asc/desc order resp.). 
     * @param {Number} opts.limit Maximum number of apps to return. If not provided, the limit is 100.
     * @param {Number} opts.offset Number of apps past &#x60;start&#x60; to skip.
     * @param {module:api/PluginsApi~getPluginsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Plugin>}
     */
    this.getPlugins = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'group_id': opts['groupId'],
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
      var returnType = [Plugin];

      return this.apiClient.callApi(
        '/sys/v1/plugins', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the invokePlugin operation.
     * @callback module:api/PluginsApi~invokePluginCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PluginInvokeResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Invoke a plugin
     * Invokes a plugin execution with the provided request body as input to the plugin.
     * @param {String} pluginId Plugin Identifier
     * @param {module:model/PluginInvokeRequest} body Object to be passed to plugin as input
     * @param {module:api/PluginsApi~invokePluginCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PluginInvokeResponse}
     */
    this.invokePlugin = function(pluginId, body, callback) {
      var postBody = body;

      // verify the required parameter 'pluginId' is set
      if (pluginId === undefined || pluginId === null) {
        throw new Error("Missing the required parameter 'pluginId' when calling invokePlugin");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling invokePlugin");
      }


      var pathParams = {
        'plugin-id': pluginId
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
      var returnType = PluginInvokeResponse;

      return this.apiClient.callApi(
        '/sys/v1/plugins/{plugin-id}', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the sysV1PluginsInvokePluginIdGet operation.
     * @callback module:api/PluginsApi~sysV1PluginsInvokePluginIdGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PluginInvokeResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Invoke a plugin using GET.
     * Invokes a plugin with empty input.
     * @param {String} pluginId Plugin Identifier
     * @param {module:api/PluginsApi~sysV1PluginsInvokePluginIdGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PluginInvokeResponse}
     */
    this.sysV1PluginsInvokePluginIdGet = function(pluginId, callback) {
      var postBody = null;

      // verify the required parameter 'pluginId' is set
      if (pluginId === undefined || pluginId === null) {
        throw new Error("Missing the required parameter 'pluginId' when calling sysV1PluginsInvokePluginIdGet");
      }


      var pathParams = {
        'plugin-id': pluginId
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
      var returnType = PluginInvokeResponse;

      return this.apiClient.callApi(
        '/sys/v1/plugins/invoke/{plugin-id}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the updatePlugin operation.
     * @callback module:api/PluginsApi~updatePluginCallback
     * @param {String} error Error message, if any.
     * @param {module:model/App} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Update a plugin
     * Change a plugin&#39;s properties, such as name, description, code, or group membership.
     * @param {String} pluginId Plugin Identifier
     * @param {module:model/PluginRequest} body Properties of plugin to create
     * @param {module:api/PluginsApi~updatePluginCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/App}
     */
    this.updatePlugin = function(pluginId, body, callback) {
      var postBody = body;

      // verify the required parameter 'pluginId' is set
      if (pluginId === undefined || pluginId === null) {
        throw new Error("Missing the required parameter 'pluginId' when calling updatePlugin");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling updatePlugin");
      }


      var pathParams = {
        'plugin-id': pluginId
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
      var returnType = App;

      return this.apiClient.callApi(
        '/sys/v1/plugins/{plugin-id}', 'PATCH',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));
