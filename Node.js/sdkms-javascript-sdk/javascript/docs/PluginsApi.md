# FortanixSdkmsRestApi.PluginsApi

All URIs are relative to *https://apps.smartkey.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createPlugin**](PluginsApi.md#createPlugin) | **POST** /sys/v1/plugins | Create a new plugin
[**deletePlugin**](PluginsApi.md#deletePlugin) | **DELETE** /sys/v1/plugins/{plugin-id} | Delete plugin
[**getPlugin**](PluginsApi.md#getPlugin) | **GET** /sys/v1/plugins/{plugin-id} | Get a specific plugin
[**getPlugins**](PluginsApi.md#getPlugins) | **GET** /sys/v1/plugins | Get all plugins
[**invokePlugin**](PluginsApi.md#invokePlugin) | **POST** /sys/v1/plugins/{plugin-id} | Invoke a plugin
[**sysV1PluginsInvokePluginIdGet**](PluginsApi.md#sysV1PluginsInvokePluginIdGet) | **GET** /sys/v1/plugins/invoke/{plugin-id} | Invoke a plugin using GET.
[**updatePlugin**](PluginsApi.md#updatePlugin) | **PATCH** /sys/v1/plugins/{plugin-id} | Update a plugin


<a name="createPlugin"></a>
# **createPlugin**
> Plugin createPlugin(body)

Create a new plugin

Create a new plugin with the specified properties.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.PluginsApi();

var body = new FortanixSdkmsRestApi.PluginRequest(); // PluginRequest | Properties of plugin to create


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.createPlugin(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**PluginRequest**](PluginRequest.md)| Properties of plugin to create | 

### Return type

[**Plugin**](Plugin.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="deletePlugin"></a>
# **deletePlugin**
> deletePlugin(pluginId)

Delete plugin

Remove a plugin from SDKMS.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.PluginsApi();

var pluginId = "pluginId_example"; // String | Plugin Identifier


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.deletePlugin(pluginId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pluginId** | **String**| Plugin Identifier | 

### Return type

null (empty response body)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getPlugin"></a>
# **getPlugin**
> Plugin getPlugin(pluginId)

Get a specific plugin

Look up plugin by plugin ID.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.PluginsApi();

var pluginId = "pluginId_example"; // String | Plugin Identifier


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getPlugin(pluginId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pluginId** | **String**| Plugin Identifier | 

### Return type

[**Plugin**](Plugin.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getPlugins"></a>
# **getPlugins**
> [Plugin] getPlugins(opts)

Get all plugins

Get details of all plugins the current user has access to.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.PluginsApi();

var opts = { 
  'groupId': "groupId_example", // String | Only retrieve plugins in the specified group.
  'sort': "sort_example", // String | This specifies the property (`plugin_id` only, for now) and order (ascending or descending) with which to sort the apps. By default, plugins are sorted by `plugin_id` in ascending order. The syntax is \"<property>:[asc|desc]\" (e.g. \"plugin_id:desc\") or just \"<property>\" (ascending order by default). 
  'start': "start_example", // String | If provided, this must be a value of the property specified in `sort`. Returned apps will begin just above or just below this value (for asc/desc order resp.). 
  'limit': 56, // Number | Maximum number of apps to return. If not provided, the limit is 100.
  'offset': 56 // Number | Number of apps past `start` to skip.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getPlugins(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **groupId** | **String**| Only retrieve plugins in the specified group. | [optional] 
 **sort** | **String**| This specifies the property (&#x60;plugin_id&#x60; only, for now) and order (ascending or descending) with which to sort the apps. By default, plugins are sorted by &#x60;plugin_id&#x60; in ascending order. The syntax is \&quot;&lt;property&gt;:[asc|desc]\&quot; (e.g. \&quot;plugin_id:desc\&quot;) or just \&quot;&lt;property&gt;\&quot; (ascending order by default).  | [optional] 
 **start** | **String**| If provided, this must be a value of the property specified in &#x60;sort&#x60;. Returned apps will begin just above or just below this value (for asc/desc order resp.).  | [optional] 
 **limit** | **Number**| Maximum number of apps to return. If not provided, the limit is 100. | [optional] 
 **offset** | **Number**| Number of apps past &#x60;start&#x60; to skip. | [optional] 

### Return type

[**[Plugin]**](Plugin.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="invokePlugin"></a>
# **invokePlugin**
> PluginInvokeResponse invokePlugin(pluginIdbody)

Invoke a plugin

Invokes a plugin execution with the provided request body as input to the plugin.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.PluginsApi();

var pluginId = "pluginId_example"; // String | Plugin Identifier

var body = new FortanixSdkmsRestApi.PluginInvokeRequest(); // PluginInvokeRequest | Object to be passed to plugin as input


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.invokePlugin(pluginIdbody, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pluginId** | **String**| Plugin Identifier | 
 **body** | [**PluginInvokeRequest**](PluginInvokeRequest.md)| Object to be passed to plugin as input | 

### Return type

[**PluginInvokeResponse**](PluginInvokeResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="sysV1PluginsInvokePluginIdGet"></a>
# **sysV1PluginsInvokePluginIdGet**
> PluginInvokeResponse sysV1PluginsInvokePluginIdGet(pluginId)

Invoke a plugin using GET.

Invokes a plugin with empty input.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.PluginsApi();

var pluginId = "pluginId_example"; // String | Plugin Identifier


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.sysV1PluginsInvokePluginIdGet(pluginId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pluginId** | **String**| Plugin Identifier | 

### Return type

[**PluginInvokeResponse**](PluginInvokeResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="updatePlugin"></a>
# **updatePlugin**
> App updatePlugin(pluginIdbody)

Update a plugin

Change a plugin&#39;s properties, such as name, description, code, or group membership.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.PluginsApi();

var pluginId = "pluginId_example"; // String | Plugin Identifier

var body = new FortanixSdkmsRestApi.PluginRequest(); // PluginRequest | Properties of plugin to create


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.updatePlugin(pluginIdbody, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pluginId** | **String**| Plugin Identifier | 
 **body** | [**PluginRequest**](PluginRequest.md)| Properties of plugin to create | 

### Return type

[**App**](App.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

