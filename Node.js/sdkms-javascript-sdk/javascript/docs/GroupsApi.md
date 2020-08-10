# FortanixSdkmsRestApi.GroupsApi

All URIs are relative to *https://apps.smartkey.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createGroup**](GroupsApi.md#createGroup) | **POST** /sys/v1/groups | Create new group
[**deleteGroup**](GroupsApi.md#deleteGroup) | **DELETE** /sys/v1/groups/{group-id} | Delete group
[**getGroup**](GroupsApi.md#getGroup) | **GET** /sys/v1/groups/{group-id} | Get a specific group
[**getGroups**](GroupsApi.md#getGroups) | **GET** /sys/v1/groups | Get all groups
[**updateGroup**](GroupsApi.md#updateGroup) | **PATCH** /sys/v1/groups/{group-id} | Update group


<a name="createGroup"></a>
# **createGroup**
> Group createGroup(body)

Create new group

Create a new group with the specified properties.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.GroupsApi();

var body = new FortanixSdkmsRestApi.GroupRequest(); // GroupRequest | Name of group


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.createGroup(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**GroupRequest**](GroupRequest.md)| Name of group | 

### Return type

[**Group**](Group.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="deleteGroup"></a>
# **deleteGroup**
> deleteGroup(groupId, )

Delete group

Remove a group from SDKMS.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.GroupsApi();

var groupId = "groupId_example"; // String | Group Identifier


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.deleteGroup(groupId, , callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **groupId** | **String**| Group Identifier | 

### Return type

null (empty response body)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getGroup"></a>
# **getGroup**
> Group getGroup(groupId, )

Get a specific group

Look up a specific group by group ID.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.GroupsApi();

var groupId = "groupId_example"; // String | Group Identifier


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getGroup(groupId, , callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **groupId** | **String**| Group Identifier | 

### Return type

[**Group**](Group.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getGroups"></a>
# **getGroups**
> [Group] getGroups()

Get all groups

Get detailed information about all groups the authenticated User or authenticated Application belongs to.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.GroupsApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getGroups(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[Group]**](Group.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="updateGroup"></a>
# **updateGroup**
> Group updateGroup(groupId, body)

Update group

Change a group&#39;s properties.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.GroupsApi();

var groupId = "groupId_example"; // String | Group Identifier

var body = new FortanixSdkmsRestApi.GroupRequest(); // GroupRequest | Name of group


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.updateGroup(groupId, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **groupId** | **String**| Group Identifier | 
 **body** | [**GroupRequest**](GroupRequest.md)| Name of group | 

### Return type

[**Group**](Group.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

