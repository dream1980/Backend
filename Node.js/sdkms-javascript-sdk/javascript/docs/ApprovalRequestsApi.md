# FortanixSdkmsRestApi.ApprovalRequestsApi

All URIs are relative to *https://apps.smartkey.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**approve**](ApprovalRequestsApi.md#approve) | **POST** /sys/v1/approval_requests/{request-id}/approve | Approve a request.
[**createApprovalRequest**](ApprovalRequestsApi.md#createApprovalRequest) | **POST** /sys/v1/approval_requests | Create approval request
[**deleteApprovalRequest**](ApprovalRequestsApi.md#deleteApprovalRequest) | **DELETE** /sys/v1/approval_requests/{request-id} | Delete an approval request.
[**deny**](ApprovalRequestsApi.md#deny) | **POST** /sys/v1/approval_requests/{request-id}/deny | Deny a request.
[**getApprovalRequest**](ApprovalRequestsApi.md#getApprovalRequest) | **GET** /sys/v1/approval_requests/{request-id} | Get an approval request.
[**getApprovalRequests**](ApprovalRequestsApi.md#getApprovalRequests) | **GET** /sys/v1/approval_requests | Get all approval requests
[**getResult**](ApprovalRequestsApi.md#getResult) | **POST** /sys/v1/approval_requests/{request-id}/result | Get the result for an approved or failed request.


<a name="approve"></a>
# **approve**
> approve(requestId)

Approve a request.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.ApprovalRequestsApi();

var requestId = "requestId_example"; // String | Approval Request Identifier


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.approve(requestId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **requestId** | **String**| Approval Request Identifier | 

### Return type

null (empty response body)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="createApprovalRequest"></a>
# **createApprovalRequest**
> ApprovalRequest createApprovalRequest(body)

Create approval request

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.ApprovalRequestsApi();

var body = new FortanixSdkmsRestApi.ApprovalRequestRequest(); // ApprovalRequestRequest | Request to create an approval request.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.createApprovalRequest(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**ApprovalRequestRequest**](ApprovalRequestRequest.md)| Request to create an approval request. | 

### Return type

[**ApprovalRequest**](ApprovalRequest.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="deleteApprovalRequest"></a>
# **deleteApprovalRequest**
> deleteApprovalRequest(requestId)

Delete an approval request.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.ApprovalRequestsApi();

var requestId = "requestId_example"; // String | Approval Request Identifier


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.deleteApprovalRequest(requestId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **requestId** | **String**| Approval Request Identifier | 

### Return type

null (empty response body)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="deny"></a>
# **deny**
> deny(requestId)

Deny a request.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.ApprovalRequestsApi();

var requestId = "requestId_example"; // String | Approval Request Identifier


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.deny(requestId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **requestId** | **String**| Approval Request Identifier | 

### Return type

null (empty response body)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getApprovalRequest"></a>
# **getApprovalRequest**
> ApprovalRequest getApprovalRequest(requestId)

Get an approval request.

Get the details and status of a particular approval request.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.ApprovalRequestsApi();

var requestId = "requestId_example"; // String | Approval Request Identifier


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getApprovalRequest(requestId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **requestId** | **String**| Approval Request Identifier | 

### Return type

[**ApprovalRequest**](ApprovalRequest.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getApprovalRequests"></a>
# **getApprovalRequests**
> [ApprovalRequest] getApprovalRequests(opts)

Get all approval requests

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.ApprovalRequestsApi();

var opts = { 
  'requester': "requester_example", // String | Only retrieve approval requests with the specified requester ID
  'reviewer': "reviewer_example", // String | Only retrieve approval requests with the specified reviewer ID
  'subject': "subject_example", // String | Only retrieve approval requests with the specified subject ID
  'status': "status_example" // String | Only retrieve approval requests with the specified approval status
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getApprovalRequests(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **requester** | **String**| Only retrieve approval requests with the specified requester ID | [optional] 
 **reviewer** | **String**| Only retrieve approval requests with the specified reviewer ID | [optional] 
 **subject** | **String**| Only retrieve approval requests with the specified subject ID | [optional] 
 **status** | **String**| Only retrieve approval requests with the specified approval status | [optional] 

### Return type

[**[ApprovalRequest]**](ApprovalRequest.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getResult"></a>
# **getResult**
> ApprovableResult getResult(requestId)

Get the result for an approved or failed request.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.ApprovalRequestsApi();

var requestId = "requestId_example"; // String | Approval Request Identifier


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getResult(requestId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **requestId** | **String**| Approval Request Identifier | 

### Return type

[**ApprovableResult**](ApprovableResult.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

