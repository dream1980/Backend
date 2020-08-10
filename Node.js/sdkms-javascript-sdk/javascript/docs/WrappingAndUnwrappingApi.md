# FortanixSdkmsRestApi.WrappingAndUnwrappingApi

All URIs are relative to *https://apps.smartkey.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**unwrapKey**](WrappingAndUnwrappingApi.md#unwrapKey) | **POST** /crypto/v1/keys/{key-id}/unwrapkey | Unwrap a security object with a key
[**unwrapKeyEx**](WrappingAndUnwrappingApi.md#unwrapKeyEx) | **POST** /crypto/v1/unwrapkey | Unwrap a security object with a key
[**wrapKey**](WrappingAndUnwrappingApi.md#wrapKey) | **POST** /crypto/v1/keys/{key-id}/wrapkey | Wrap a security object with a key 
[**wrapKeyEx**](WrappingAndUnwrappingApi.md#wrapKeyEx) | **POST** /crypto/v1/wrapkey | Wrap a security object with a key 


<a name="unwrapKey"></a>
# **unwrapKey**
> KeyObject unwrapKey(keyId, body)

Unwrap a security object with a key

Unwrap (decrypt) a wrapped key and import it into SDKMS. This allows securely importing into SDKMS security objects that were previously wrapped by SDKMS or another key management system. A new security object will be created in SDKMS with the unwrapped data. &lt;br&gt; The key-id parameter in the URL specifies the key that will be used to unwrap the other security object. This key must have the unwrapkey operation enabled. &lt;br&gt; The alg and mode parameters specify the encryption algorithm and cipher mode being used by the unwrapping key. The obj_type parameter specifies the object type of the security object being unwrapped. The size or elliptic curve of the object being unwrapped does not need to be specified. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.WrappingAndUnwrappingApi();

var keyId = "keyId_example"; // String | kid of security object

var body = new FortanixSdkmsRestApi.UnwrapKeyRequest(); // UnwrapKeyRequest | Unwrap key request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.unwrapKey(keyId, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyId** | **String**| kid of security object | 
 **body** | [**UnwrapKeyRequest**](UnwrapKeyRequest.md)| Unwrap key request | 

### Return type

[**KeyObject**](KeyObject.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="unwrapKeyEx"></a>
# **unwrapKeyEx**
> KeyObject unwrapKeyEx(body)

Unwrap a security object with a key

Unwrap (decrypt) a wrapped key and import it into SDKMS. This allows securely importing into SDKMS security objects that were previously wrapped by SDKMS or another key management system. A new security object will be created in SDKMS with the unwrapped data. &lt;br&gt; The key-id parameter in the URL specifies the key that will be used to unwrap the other security object. This key must have the unwrapkey operation enabled. &lt;br&gt; The alg and mode parameters specify the encryption algorithm and cipher mode being used by the unwrapping key. The obj_type parameter specifies the object type of the security object being unwrapped. The size or elliptic curve of the object being unwrapped does not need to be specified. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.WrappingAndUnwrappingApi();

var body = new FortanixSdkmsRestApi.UnwrapKeyRequestEx(); // UnwrapKeyRequestEx | Unwrap key request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.unwrapKeyEx(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**UnwrapKeyRequestEx**](UnwrapKeyRequestEx.md)| Unwrap key request | 

### Return type

[**KeyObject**](KeyObject.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="wrapKey"></a>
# **wrapKey**
> WrapKeyResponse wrapKey(keyId, body)

Wrap a security object with a key 

Wrap (encrypt) an existing security object with a key. This allows keys to be securely exported from SDKMS so they can be later imported into SDKMS or another key management system. &lt;br&gt; The key-id parameter in the URL specifies the key that will be used to wrap the other security object. The security object being wrapped is specified inside of the request body. &lt;br&gt; The alg and mode parameters specify the encryption algorithm and cipher mode being used for the wrapping key. The algorithm of the key being wrapped is not provided to this API call. &lt;br&gt; The key being wrapped must have the export operation enabled. The wrapping key must have the wrapkey operation enabled. &lt;br&gt; The following wrapping operations are supported:   * Symmetric keys, HMAC keys, opaque objects, and secret objects may be wrapped with symmetric or asymmetric keys.   * Asymmetric keys may be wrapped with symmetric keys. Wrapping an asymmetric key with an asymmetric key is not supported.  When wrapping with an asymmetric key, the wrapped object size must fit as plaintext for the wrapping key size and algorithm. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.WrappingAndUnwrappingApi();

var keyId = "keyId_example"; // String | kid of security object

var body = new FortanixSdkmsRestApi.WrapKeyRequest(); // WrapKeyRequest | Wrap key request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.wrapKey(keyId, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyId** | **String**| kid of security object | 
 **body** | [**WrapKeyRequest**](WrapKeyRequest.md)| Wrap key request | 

### Return type

[**WrapKeyResponse**](WrapKeyResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="wrapKeyEx"></a>
# **wrapKeyEx**
> WrapKeyResponse wrapKeyEx(body)

Wrap a security object with a key 

Wrap (encrypt) an existing security object with a key. This allows keys to be securely exported from SDKMS so they can be later imported into SDKMS or another key management system. &lt;br&gt; The key-id parameter in the URL specifies the key that will be used to wrap the other security object. The security object being wrapped is specified inside of the request body. &lt;br&gt; The alg and mode parameters specify the encryption algorithm and cipher mode being used for the wrapping key. The algorithm of the key being wrapped is not provided to this API call. &lt;br&gt; The key being wrapped must have the export operation enabled. The wrapping key must have the wrapkey operation enabled. &lt;br&gt; The following wrapping operations are supported:   * Symmetric keys, HMAC keys, opaque objects, and secret objects may be wrapped with symmetric or asymmetric keys.   * Asymmetric keys may be wrapped with symmetric keys. Wrapping an asymmetric key with an asymmetric key is not supported.  When wrapping with an asymmetric key, the wrapped object size must fit as plaintext for the wrapping key size and algorithm. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.WrappingAndUnwrappingApi();

var body = new FortanixSdkmsRestApi.WrapKeyRequestEx(); // WrapKeyRequestEx | Wrap key request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.wrapKeyEx(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**WrapKeyRequestEx**](WrapKeyRequestEx.md)| Wrap key request | 

### Return type

[**WrapKeyResponse**](WrapKeyResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

