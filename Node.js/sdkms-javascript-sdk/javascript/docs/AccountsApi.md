# FortanixSdkmsRestApi.AccountsApi

All URIs are relative to *https://apps.smartkey.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createAccount**](AccountsApi.md#createAccount) | **POST** /sys/v1/accounts | Create a new account
[**deleteAccount**](AccountsApi.md#deleteAccount) | **DELETE** /sys/v1/accounts/{account-id} | Delete account
[**getAccount**](AccountsApi.md#getAccount) | **GET** /sys/v1/accounts/{account-id} | Get a specific account
[**getAccounts**](AccountsApi.md#getAccounts) | **GET** /sys/v1/accounts | Get all accounts
[**updateAccount**](AccountsApi.md#updateAccount) | **PATCH** /sys/v1/accounts/{account-id} | Update account


<a name="createAccount"></a>
# **createAccount**
> Account createAccount(body)

Create a new account

Create a new account with the specified properties.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.AccountsApi();

var body = new FortanixSdkmsRestApi.AccountRequest(); // AccountRequest | Properties to assign to Account.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.createAccount(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**AccountRequest**](AccountRequest.md)| Properties to assign to Account. | 

### Return type

[**Account**](Account.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="deleteAccount"></a>
# **deleteAccount**
> deleteAccount(accountId, )

Delete account

Remove an account from SDKMS.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.AccountsApi();

var accountId = "accountId_example"; // String | Account Identifier


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.deleteAccount(accountId, , callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **accountId** | **String**| Account Identifier | 

### Return type

null (empty response body)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getAccount"></a>
# **getAccount**
> Account getAccount(accountId, )

Get a specific account

Look up an account by account ID.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.AccountsApi();

var accountId = "accountId_example"; // String | Account Identifier


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getAccount(accountId, , callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **accountId** | **String**| Account Identifier | 

### Return type

[**Account**](Account.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getAccounts"></a>
# **getAccounts**
> [Account] getAccounts()

Get all accounts

Get detailed information on all accounts the current user has access to.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.AccountsApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getAccounts(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[Account]**](Account.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="updateAccount"></a>
# **updateAccount**
> Account updateAccount(accountId, body)

Update account

Update the properties of an account. Only certain properties may be changed with this API. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.AccountsApi();

var accountId = "accountId_example"; // String | Account Identifier

var body = new FortanixSdkmsRestApi.AccountRequest(); // AccountRequest | Properties to assign to Account.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.updateAccount(accountId, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **accountId** | **String**| Account Identifier | 
 **body** | [**AccountRequest**](AccountRequest.md)| Properties to assign to Account. | 

### Return type

[**Account**](Account.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

