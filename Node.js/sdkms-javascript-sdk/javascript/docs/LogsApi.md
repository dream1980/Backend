# FortanixSdkmsRestApi.LogsApi

All URIs are relative to *https://apps.smartkey.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getAuditLogs**](LogsApi.md#getAuditLogs) | **GET** /sys/v1/logs | Get audit logs


<a name="getAuditLogs"></a>
# **getAuditLogs**
> AuditLogResponse getAuditLogs(opts)

Get audit logs

Get audit log entries matching the requested filters.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.LogsApi();

var opts = { 
  'size': 56, // Number | Maximum number of entries to return
  'from': 56, // Number | For pagination, starting offset
  'actionType': "actionType_example", // String | Event action type
  'actorType': "actorType_example", // String | Event actor type
  'actorId': "actorId_example", // String | Actor (User or App) Identifier
  'objectId': "objectId_example", // String | Object (User or App) Identifier for event
  'severity': "severity_example", // String | Event severity type
  'rangeFrom': 56, // Number | Starting time for search , this is EPOCH value
  'rangeTo': 56 // Number | Ending time for search , this is EPOCH value
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getAuditLogs(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **size** | **Number**| Maximum number of entries to return | [optional] 
 **from** | **Number**| For pagination, starting offset | [optional] 
 **actionType** | **String**| Event action type | [optional] 
 **actorType** | **String**| Event actor type | [optional] 
 **actorId** | **String**| Actor (User or App) Identifier | [optional] 
 **objectId** | **String**| Object (User or App) Identifier for event | [optional] 
 **severity** | **String**| Event severity type | [optional] 
 **rangeFrom** | **Number**| Starting time for search , this is EPOCH value | [optional] 
 **rangeTo** | **Number**| Ending time for search , this is EPOCH value | [optional] 

### Return type

[**AuditLogResponse**](AuditLogResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

