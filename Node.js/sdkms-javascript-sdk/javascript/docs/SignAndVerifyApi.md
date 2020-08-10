# FortanixSdkmsRestApi.SignAndVerifyApi

All URIs are relative to *https://apps.smartkey.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**batchSign**](SignAndVerifyApi.md#batchSign) | **POST** /crypto/v1/keys/batch/sign | Batch sign with one or more private keys
[**batchVerify**](SignAndVerifyApi.md#batchVerify) | **POST** /crypto/v1/keys/batch/verify | Batch verify with one or more private keys
[**sign**](SignAndVerifyApi.md#sign) | **POST** /crypto/v1/keys/{key-id}/sign | Sign with a private key
[**signEx**](SignAndVerifyApi.md#signEx) | **POST** /crypto/v1/sign | Sign with a private key
[**verify**](SignAndVerifyApi.md#verify) | **POST** /crypto/v1/keys/{key-id}/verify | Verify a signature with a key
[**verifyEx**](SignAndVerifyApi.md#verifyEx) | **POST** /crypto/v1/verify | Verify a signature with a key


<a name="batchSign"></a>
# **batchSign**
> BatchSignResponse batchSign(body)

Batch sign with one or more private keys

The data to be signed and the key ids to be used are provided in the request body. The signature is returned in the response body. The ordering of the body matches the ordering of the request. An individual status code is returned for each batch item. Maximum size of the entire batch request is 512 KB. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.SignAndVerifyApi();

var body = new FortanixSdkmsRestApi.BatchSignRequest(); // BatchSignRequest | Batch Sign request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.batchSign(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**BatchSignRequest**](BatchSignRequest.md)| Batch Sign request | 

### Return type

[**BatchSignResponse**](BatchSignResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="batchVerify"></a>
# **batchVerify**
> BatchVerifyResponse batchVerify(body)

Batch verify with one or more private keys

The signature to be verified and the key ids to be used are provided in the request body. The result (true of false) returned in the response body. The ordering of the body matches the ordering of the request. An individual status code is returned for each batch item. Maximum size of the entire batch request is 512 KB. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.SignAndVerifyApi();

var body = new FortanixSdkmsRestApi.BatchVerifyRequest(); // BatchVerifyRequest | Batch Verify request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.batchVerify(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**BatchVerifyRequest**](BatchVerifyRequest.md)| Batch Verify request | 

### Return type

[**BatchVerifyResponse**](BatchVerifyResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="sign"></a>
# **sign**
> SignResponse sign(keyId, body)

Sign with a private key

Sign data with a private key. The signing key must be an asymmetric key with the private part present. The sign operation must be enabled for this key. Symmetric keys  may not be used to sign data. They can be used with the computeMac and verifyMac methods. &lt;br&gt; The data must be hashed with a SHA-1 or SHA-2 family hash algorithm. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.SignAndVerifyApi();

var keyId = "keyId_example"; // String | kid of security object

var body = new FortanixSdkmsRestApi.SignRequest(); // SignRequest | Signature request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.sign(keyId, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyId** | **String**| kid of security object | 
 **body** | [**SignRequest**](SignRequest.md)| Signature request | 

### Return type

[**SignResponse**](SignResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="signEx"></a>
# **signEx**
> SignResponse signEx(body)

Sign with a private key

Sign data with a private key. The signing key must be an asymmetric key with the private part present. The sign operation must be enabled for this key. Symmetric keys  may not be used to sign data. They can be used with the computeMac and verifyMac methods. &lt;br&gt; The data must be hashed with a SHA-1 or SHA-2 family hash algorithm. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.SignAndVerifyApi();

var body = new FortanixSdkmsRestApi.SignRequestEx(); // SignRequestEx | Signature request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.signEx(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**SignRequestEx**](SignRequestEx.md)| Signature request | 

### Return type

[**SignResponse**](SignResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="verify"></a>
# **verify**
> VerifyResponse verify(keyId, body)

Verify a signature with a key

Verify a signature with a public key. The verifying key must be an asymmetric key with the verify operation enabled. Symmetric keys may not be used to verify data. They can be used with the computeMac and verifyMac operations. &lt;br&gt; The signature must have been created with a SHA-1 or SHA-2 family hash algorithm. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.SignAndVerifyApi();

var keyId = "keyId_example"; // String | kid of security object

var body = new FortanixSdkmsRestApi.VerifyRequest(); // VerifyRequest | Verification request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.verify(keyId, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyId** | **String**| kid of security object | 
 **body** | [**VerifyRequest**](VerifyRequest.md)| Verification request | 

### Return type

[**VerifyResponse**](VerifyResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="verifyEx"></a>
# **verifyEx**
> VerifyResponse verifyEx(body)

Verify a signature with a key

Verify a signature with a public key. The verifying key must be an asymmetric key with the verify operation enabled. Symmetric keys may not be used to verify data. They can be used with the computeMac and verifyMac operations. &lt;br&gt; The signature must have been created with a SHA-1 or SHA-2 family hash algorithm. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.SignAndVerifyApi();

var body = new FortanixSdkmsRestApi.VerifyRequestEx(); // VerifyRequestEx | Verification request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.verifyEx(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**VerifyRequestEx**](VerifyRequestEx.md)| Verification request | 

### Return type

[**VerifyResponse**](VerifyResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

