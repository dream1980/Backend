# FortanixSdkmsRestApi.AppsApi

All URIs are relative to *https://apps.smartkey.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createApp**](AppsApi.md#createApp) | **POST** /sys/v1/apps | Create a new application
[**deleteApp**](AppsApi.md#deleteApp) | **DELETE** /sys/v1/apps/{app-id} | Delete application
[**getApp**](AppsApi.md#getApp) | **GET** /sys/v1/apps/{app-id} | Get a specific application
[**getApps**](AppsApi.md#getApps) | **GET** /sys/v1/apps | Get all applications
[**getCredential**](AppsApi.md#getCredential) | **GET** /sys/v1/apps/{app-id}/credential | Get a specific application&#39;s credential
[**regenerateApiKey**](AppsApi.md#regenerateApiKey) | **POST** /sys/v1/apps/{app-id}/reset_secret | Regenerate API key
[**updateApp**](AppsApi.md#updateApp) | **PATCH** /sys/v1/apps/{app-id} | Update an application


<a name="createApp"></a>
# **createApp**
> App createApp(body)

Create a new application

Create a new application with the specified properties.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.AppsApi();

var body = new FortanixSdkmsRestApi.AppRequest(); // AppRequest | Properties of application to create


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.createApp(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**AppRequest**](AppRequest.md)| Properties of application to create | 

### Return type

[**App**](App.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="deleteApp"></a>
# **deleteApp**
> deleteApp(appId)

Delete application

Remove an application from SDKMS.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.AppsApi();

var appId = "appId_example"; // String | Application Identifier


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.deleteApp(appId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **appId** | **String**| Application Identifier | 

### Return type

null (empty response body)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getApp"></a>
# **getApp**
> App getApp(appId)

Get a specific application

Look up an application by application ID.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.AppsApi();

var appId = "appId_example"; // String | Application Identifier


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getApp(appId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **appId** | **String**| Application Identifier | 

### Return type

[**App**](App.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getApps"></a>
# **getApps**
> [App] getApps(opts)

Get all applications

Get details of all applications the current user has access to.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.AppsApi();

var opts = { 
  'groupId': "groupId_example", // String | Only retrieve applications in the specified group.
  'sort': "sort_example", // String | This specifies the property (`app_id` only, for now) and order (ascending or descending) with which to sort the apps. By default, apps are sorted by `app_id` in ascending order. The syntax is \"<property>:[asc|desc]\" (e.g. \"app_id:desc\") or just \"<property>\" (ascending order by default). 
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
apiInstance.getApps(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **groupId** | **String**| Only retrieve applications in the specified group. | [optional] 
 **sort** | **String**| This specifies the property (&#x60;app_id&#x60; only, for now) and order (ascending or descending) with which to sort the apps. By default, apps are sorted by &#x60;app_id&#x60; in ascending order. The syntax is \&quot;&lt;property&gt;:[asc|desc]\&quot; (e.g. \&quot;app_id:desc\&quot;) or just \&quot;&lt;property&gt;\&quot; (ascending order by default).  | [optional] 
 **start** | **String**| If provided, this must be a value of the property specified in &#x60;sort&#x60;. Returned apps will begin just above or just below this value (for asc/desc order resp.).  | [optional] 
 **limit** | **Number**| Maximum number of apps to return. If not provided, the limit is 100. | [optional] 
 **offset** | **Number**| Number of apps past &#x60;start&#x60; to skip. | [optional] 

### Return type

[**[App]**](App.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getCredential"></a>
# **getCredential**
> AppCredentialResponse getCredential(appId)

Get a specific application&#39;s credential

Retrieve the authentication credential (API key or certificate) for a particular application. Only users who are an administrator of at least one of the application&#39;s groups can retrieve the credential.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.AppsApi();

var appId = "appId_example"; // String | Application Identifier


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getCredential(appId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **appId** | **String**| Application Identifier | 

### Return type

[**AppCredentialResponse**](AppCredentialResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="regenerateApiKey"></a>
# **regenerateApiKey**
> App regenerateApiKey(appId)

Regenerate API key

Create a new API key for an application. An application may only have one valid API key at a time, so performing this action will invalidate all old API keys. This does not invalidate existing sessions, so any applications with an existing open session will be able to continue operating with their old session until those sessions expire. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.AppsApi();

var appId = "appId_example"; // String | Application Identifier


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.regenerateApiKey(appId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **appId** | **String**| Application Identifier | 

### Return type

[**App**](App.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="updateApp"></a>
# **updateApp**
> App updateApp(appIdbody)

Update an application

Change an application&#39;s properties, such as name, description, or group membership.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.AppsApi();

var appId = "appId_example"; // String | Application Identifier

var body = new FortanixSdkmsRestApi.AppRequest(); // AppRequest | Properties of application to create


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.updateApp(appIdbody, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **appId** | **String**| Application Identifier | 
 **body** | [**AppRequest**](AppRequest.md)| Properties of application to create | 

### Return type

[**App**](App.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

