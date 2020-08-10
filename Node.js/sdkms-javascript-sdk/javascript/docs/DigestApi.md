# FortanixSdkmsRestApi.DigestApi

All URIs are relative to *https://apps.smartkey.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**computeDigest**](DigestApi.md#computeDigest) | **POST** /crypto/v1/digest | Compute a message digest of data
[**computeMac**](DigestApi.md#computeMac) | **POST** /crypto/v1/keys/{key-id}/mac | Compute MAC using a key
[**computeMacEx**](DigestApi.md#computeMacEx) | **POST** /crypto/v1/mac | Compute MAC using a key
[**verifyMac**](DigestApi.md#verifyMac) | **POST** /crypto/v1/keys/{key-id}/macverify | Verify MAC using a key
[**verifyMacEx**](DigestApi.md#verifyMacEx) | **POST** /crypto/v1/macverify | Verify MAC using a key


<a name="computeDigest"></a>
# **computeDigest**
> DigestResponse computeDigest(body)

Compute a message digest of data

This returns the digest of data provided in request body using the algorithm specified in request body. Maximum size of request body supported is 512KB. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.DigestApi();

var body = new FortanixSdkmsRestApi.DigestRequest(); // DigestRequest | Digest request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.computeDigest(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**DigestRequest**](DigestRequest.md)| Digest request | 

### Return type

[**DigestResponse**](DigestResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="computeMac"></a>
# **computeMac**
> MacGenerateResponse computeMac(keyId, body)

Compute MAC using a key

Compute a cryptographic Message Authentication Code on a message using a symmetric key. The key must have the MACGenerate operation enabled. Asymmetric keys may not be used to generate MACs. They can be used with the sign and verify operations. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.DigestApi();

var keyId = "keyId_example"; // String | kid of security object

var body = new FortanixSdkmsRestApi.MacGenerateRequest(); // MacGenerateRequest | MAC generation request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.computeMac(keyId, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyId** | **String**| kid of security object | 
 **body** | [**MacGenerateRequest**](MacGenerateRequest.md)| MAC generation request | 

### Return type

[**MacGenerateResponse**](MacGenerateResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="computeMacEx"></a>
# **computeMacEx**
> MacGenerateResponse computeMacEx(body)

Compute MAC using a key

Compute a cryptographic Message Authentication Code on a message using a symmetric key. The key must have the MACGenerate operation enabled. Asymmetric keys may not be used to generate MACs. They can be used with the sign and verify operations. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.DigestApi();

var body = new FortanixSdkmsRestApi.MacGenerateRequestEx(); // MacGenerateRequestEx | MAC generation request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.computeMacEx(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**MacGenerateRequestEx**](MacGenerateRequestEx.md)| MAC generation request | 

### Return type

[**MacGenerateResponse**](MacGenerateResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="verifyMac"></a>
# **verifyMac**
> MacVerifyResponse verifyMac(keyId, body)

Verify MAC using a key

The data to be MACed, the algorithm, and a pre-computed MAC are provided in the request body, and the key id is provided in the URL. SDKMS computes the MAC of the data and compares it with the specified MAC, and returns the outcome of the MAC verification in the response body. Maximum size of request body supported is 512KB. Supported digest algorithms are - SHA1, SHA256, SHA384, and SHA512.             

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.DigestApi();

var keyId = "keyId_example"; // String | kid of security object

var body = new FortanixSdkmsRestApi.MacVerifyRequest(); // MacVerifyRequest | MAC Verify request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.verifyMac(keyId, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyId** | **String**| kid of security object | 
 **body** | [**MacVerifyRequest**](MacVerifyRequest.md)| MAC Verify request | 

### Return type

[**MacVerifyResponse**](MacVerifyResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="verifyMacEx"></a>
# **verifyMacEx**
> MacVerifyResponse verifyMacEx(body)

Verify MAC using a key

The data to be MACed, the algorithm, and a pre-computed MAC are provided in the request body, and the key id is provided in the URL. SDKMS computes the MAC of the data and compares it with the specified MAC, and returns the outcome of the MAC verification in the response body. Maximum size of request body supported is 512KB. Supported digest algorithms are - SHA1, SHA256, SHA384, and SHA512. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.DigestApi();

var body = new FortanixSdkmsRestApi.MacVerifyRequestEx(); // MacVerifyRequestEx | MAC Verify request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.verifyMacEx(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**MacVerifyRequestEx**](MacVerifyRequestEx.md)| MAC Verify request | 

### Return type

[**MacVerifyResponse**](MacVerifyResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

