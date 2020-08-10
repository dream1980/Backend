# FortanixSdkmsRestApi.AuthenticationApi

All URIs are relative to *https://apps.smartkey.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**authorize**](AuthenticationApi.md#authorize) | **POST** /sys/v1/session/auth | Create a session for a user or an app
[**checkHealth**](AuthenticationApi.md#checkHealth) | **GET** /sys/v1/health | Check whether the server is handling requests
[**getServerVersion**](AuthenticationApi.md#getServerVersion) | **GET** /sys/v1/version | Get SDKMS version information
[**selectAccount**](AuthenticationApi.md#selectAccount) | **POST** /sys/v1/session/select_account | Select a user&#39;s account to work on
[**terminate**](AuthenticationApi.md#terminate) | **POST** /sys/v1/session/terminate | Terminate a session
[**unlock2F**](AuthenticationApi.md#unlock2F) | **POST** /sys/v1/session/config_2fa/auth | Unlock two factor configuration


<a name="authorize"></a>
# **authorize**
> AuthResponse authorize()

Create a session for a user or an app

Authenticate a user or an app to SDKMS to begin a session. The caller needs to provide a basic authentication token to authenticate to SDKMS. The response body contains a bearer authentication token which needs to be provided by subsequent calls for the duration of the session. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure HTTP basic authorization: basicAuth
var basicAuth = defaultClient.authentications['basicAuth'];
basicAuth.username = 'YOUR USERNAME';
basicAuth.password = 'YOUR PASSWORD';

var apiInstance = new FortanixSdkmsRestApi.AuthenticationApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.authorize(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**AuthResponse**](AuthResponse.md)

### Authorization

[basicAuth](../README.md#basicAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="checkHealth"></a>
# **checkHealth**
> checkHealth()

Check whether the server is handling requests

Returns a 200-class status code if the server is handling requests, or a 500-class status code if the server is having problems. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');

var apiInstance = new FortanixSdkmsRestApi.AuthenticationApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.checkHealth(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getServerVersion"></a>
# **getServerVersion**
> VersionResponse getServerVersion()

Get SDKMS version information

Returns information about the  SDKMS server version and the client API version that it supports. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');

var apiInstance = new FortanixSdkmsRestApi.AuthenticationApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getServerVersion(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**VersionResponse**](VersionResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="selectAccount"></a>
# **selectAccount**
> SelectAccountResponse selectAccount(body)

Select a user&#39;s account to work on

Select one of user&#39;s account to proceed. This is applicable when a user is associated with more than one account. The caller needs to provide a bearer token for the session in the request body. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.AuthenticationApi();

var body = new FortanixSdkmsRestApi.SelectAccountRequest(); // SelectAccountRequest | Select Account Request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.selectAccount(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**SelectAccountRequest**](SelectAccountRequest.md)| Select Account Request | 

### Return type

[**SelectAccountResponse**](SelectAccountResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="terminate"></a>
# **terminate**
> terminate()

Terminate a session

Terminate an authenticated session. After this call, the provided bearer authentication token will be invalidated and cannot be used to make any further API calls. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.AuthenticationApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.terminate(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="unlock2F"></a>
# **unlock2F**
> unlock2F()

Unlock two factor configuration

Re-authenticate to unlock two factor configuration. Two factor configuration must be unlocked to enable or disable two factor authentication, add or remove two factor devices, or regenerate recovery codes. The caller needs to provide a bearer token for the session in the request body. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.AuthenticationApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.unlock2F(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

