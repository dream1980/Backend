# FortanixSdkmsRestApi.EncryptionAndDecryptionApi

All URIs are relative to *https://apps.smartkey.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**batchDecrypt**](EncryptionAndDecryptionApi.md#batchDecrypt) | **POST** /crypto/v1/keys/batch/decrypt | Batch decrypt with one or more keys
[**batchEncrypt**](EncryptionAndDecryptionApi.md#batchEncrypt) | **POST** /crypto/v1/keys/batch/encrypt | Batch encrypt with one or more keys
[**decrypt**](EncryptionAndDecryptionApi.md#decrypt) | **POST** /crypto/v1/keys/{key-id}/decrypt | Decrypt data
[**decryptEx**](EncryptionAndDecryptionApi.md#decryptEx) | **POST** /crypto/v1/decrypt | Decrypt data
[**decryptFinal**](EncryptionAndDecryptionApi.md#decryptFinal) | **POST** /crypto/v1/keys/{key-id}/decrypt/final | Conclude multi-part decryption
[**decryptFinalEx**](EncryptionAndDecryptionApi.md#decryptFinalEx) | **POST** /crypto/v1/decrypt/final | Conclude multi-part decryption
[**decryptInit**](EncryptionAndDecryptionApi.md#decryptInit) | **POST** /crypto/v1/keys/{key-id}/decrypt/init | Begin multi-part decryption
[**decryptInitEx**](EncryptionAndDecryptionApi.md#decryptInitEx) | **POST** /crypto/v1/decrypt/init | Begin multi-part decryption
[**decryptUpdate**](EncryptionAndDecryptionApi.md#decryptUpdate) | **POST** /crypto/v1/keys/{key-id}/decrypt/update | Continue multi-part decryption
[**decryptUpdateEx**](EncryptionAndDecryptionApi.md#decryptUpdateEx) | **POST** /crypto/v1/decrypt/update | Continue multi-part decryption
[**encrypt**](EncryptionAndDecryptionApi.md#encrypt) | **POST** /crypto/v1/keys/{key-id}/encrypt | Encrypt data
[**encryptEx**](EncryptionAndDecryptionApi.md#encryptEx) | **POST** /crypto/v1/encrypt | Encrypt data
[**encryptFinal**](EncryptionAndDecryptionApi.md#encryptFinal) | **POST** /crypto/v1/keys/{key-id}/encrypt/final | Conclude multi-part encryption
[**encryptFinalEx**](EncryptionAndDecryptionApi.md#encryptFinalEx) | **POST** /crypto/v1/encrypt/final | Conclude multi-part encryption
[**encryptInit**](EncryptionAndDecryptionApi.md#encryptInit) | **POST** /crypto/v1/keys/{key-id}/encrypt/init | Begin multi-part encryption
[**encryptInitEx**](EncryptionAndDecryptionApi.md#encryptInitEx) | **POST** /crypto/v1/encrypt/init | Begin multi-part encryption
[**encryptUpdate**](EncryptionAndDecryptionApi.md#encryptUpdate) | **POST** /crypto/v1/keys/{key-id}/encrypt/update | Continue multi-part encryption
[**encryptUpdateEx**](EncryptionAndDecryptionApi.md#encryptUpdateEx) | **POST** /crypto/v1/encrypt/update | Continue multi-part encryption


<a name="batchDecrypt"></a>
# **batchDecrypt**
> BatchDecryptResponse batchDecrypt(body)

Batch decrypt with one or more keys

The data to be decrypted and the key ids to be used are provided in the request body. The decrypted plain text is returned in the response body. The ordering of the body matches the ordering of the request. An individual status code is returned for each batch item. Maximum size of the entire batch request is 512 KB. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.EncryptionAndDecryptionApi();

var body = new FortanixSdkmsRestApi.BatchDecryptRequest(); // BatchDecryptRequest | Batch decryption request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.batchDecrypt(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**BatchDecryptRequest**](BatchDecryptRequest.md)| Batch decryption request | 

### Return type

[**BatchDecryptResponse**](BatchDecryptResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="batchEncrypt"></a>
# **batchEncrypt**
> BatchEncryptResponse batchEncrypt(body)

Batch encrypt with one or more keys

The data to be encrypted and the key ids to be used are provided in the request body. The encrypted cipher text is returned in the response body. The ordering of the body matches the ordering of the request. An individual status code is returned for each batch item. Maximum size of the entire batch request is 512 KB. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.EncryptionAndDecryptionApi();

var body = new FortanixSdkmsRestApi.BatchEncryptRequest(); // BatchEncryptRequest | Batch Encryption request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.batchEncrypt(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**BatchEncryptRequest**](BatchEncryptRequest.md)| Batch Encryption request | 

### Return type

[**BatchEncryptResponse**](BatchEncryptResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="decrypt"></a>
# **decrypt**
> DecryptResponse decrypt(keyId, body)

Decrypt data

Decrypt data using a symmetric or asymmetric key. For symmetric ciphers, mode (specifying the block cipher mode) is a required field. &lt;br&gt; For GCM and CCM modes, tag_len is a required field. &lt;br&gt; iv is required for symmetric ciphers and unused for asymmetric ciphers. It must contain the initialization value used when the object was encrypted. &lt;br&gt; Objects of type opaque, EC, or HMAC may not be used for encryption or decryption. &lt;br&gt; 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.EncryptionAndDecryptionApi();

var keyId = "keyId_example"; // String | kid of security object

var body = new FortanixSdkmsRestApi.DecryptRequest(); // DecryptRequest | Decryption request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.decrypt(keyId, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyId** | **String**| kid of security object | 
 **body** | [**DecryptRequest**](DecryptRequest.md)| Decryption request | 

### Return type

[**DecryptResponse**](DecryptResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="decryptEx"></a>
# **decryptEx**
> DecryptResponse decryptEx(body)

Decrypt data

Decrypt data using a symmetric or asymmetric key. For symmetric ciphers, mode (specifying the block cipher mode) is a required field. &lt;br&gt; For GCM and CCM modes, tag_len is a required field. &lt;br&gt; iv is required for symmetric ciphers and unused for asymmetric ciphers. It must contain the initialization value used when the object was encrypted. &lt;br&gt; Objects of type opaque, EC, or HMAC may not be used for encryption or decryption. &lt;br&gt; 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.EncryptionAndDecryptionApi();

var body = new FortanixSdkmsRestApi.DecryptRequestEx(); // DecryptRequestEx | Decryption request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.decryptEx(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**DecryptRequestEx**](DecryptRequestEx.md)| Decryption request | 

### Return type

[**DecryptResponse**](DecryptResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="decryptFinal"></a>
# **decryptFinal**
> DecryptFinalResponse decryptFinal(keyId, body)

Conclude multi-part decryption

Conclude a multi-part decryption operation. See &#x60;decrypt/init&#x60; for details. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.EncryptionAndDecryptionApi();

var keyId = "keyId_example"; // String | kid of security object

var body = new FortanixSdkmsRestApi.DecryptFinalRequest(); // DecryptFinalRequest | Finish multi-part decryption


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.decryptFinal(keyId, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyId** | **String**| kid of security object | 
 **body** | [**DecryptFinalRequest**](DecryptFinalRequest.md)| Finish multi-part decryption | 

### Return type

[**DecryptFinalResponse**](DecryptFinalResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="decryptFinalEx"></a>
# **decryptFinalEx**
> DecryptFinalResponse decryptFinalEx(body)

Conclude multi-part decryption

Conclude a multi-part decryption operation. See &#x60;decrypt/init&#x60; for details. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.EncryptionAndDecryptionApi();

var body = new FortanixSdkmsRestApi.DecryptFinalRequestEx(); // DecryptFinalRequestEx | Finish multi-part decryption


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.decryptFinalEx(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**DecryptFinalRequestEx**](DecryptFinalRequestEx.md)| Finish multi-part decryption | 

### Return type

[**DecryptFinalResponse**](DecryptFinalResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="decryptInit"></a>
# **decryptInit**
> DecryptInitResponse decryptInit(keyId, body)

Begin multi-part decryption

This API is used when decrypting more data than the client wishes to submit in a single request. It supports only symmetric ciphers and only conventional (not AEAD) modes of operation. To perform multi-part decryption, the client makes one request to the &#x60;init&#x60; resource, zero or more requests to the &#x60;update&#x60; resource, followed by one request to the &#x60;final&#x60; resource. The response to init and update requests includes a &#x60;state&#x60; field. The &#x60;state&#x60; is an opaque data blob that must be supplied unmodified by the client with the subsequent request. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.EncryptionAndDecryptionApi();

var keyId = "keyId_example"; // String | kid of security object

var body = new FortanixSdkmsRestApi.DecryptInitRequest(); // DecryptInitRequest | Multi-part decryption initialization request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.decryptInit(keyId, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyId** | **String**| kid of security object | 
 **body** | [**DecryptInitRequest**](DecryptInitRequest.md)| Multi-part decryption initialization request | 

### Return type

[**DecryptInitResponse**](DecryptInitResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="decryptInitEx"></a>
# **decryptInitEx**
> DecryptInitResponse decryptInitEx(body)

Begin multi-part decryption

This API is used when decrypting more data than the client wishes to submit in a single request. It supports only symmetric ciphers and only conventional (not AEAD) modes of operation. To perform multi-part decryption, the client makes one request to the &#x60;init&#x60; resource, zero or more requests to the &#x60;update&#x60; resource, followed by one request to the &#x60;final&#x60; resource. The response to init and update requests includes a &#x60;state&#x60; field. The &#x60;state&#x60; is an opaque data blob that must be supplied unmodified by the client with the subsequent request. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.EncryptionAndDecryptionApi();

var body = new FortanixSdkmsRestApi.DecryptInitRequestEx(); // DecryptInitRequestEx | Multi-part decryption initialization request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.decryptInitEx(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**DecryptInitRequestEx**](DecryptInitRequestEx.md)| Multi-part decryption initialization request | 

### Return type

[**DecryptInitResponse**](DecryptInitResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="decryptUpdate"></a>
# **decryptUpdate**
> DecryptUpdateResponse decryptUpdate(keyId, body)

Continue multi-part decryption

Continue a multi-part decryption operation. See &#x60;decrypt/init&#x60; for details. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.EncryptionAndDecryptionApi();

var keyId = "keyId_example"; // String | kid of security object

var body = new FortanixSdkmsRestApi.DecryptUpdateRequest(); // DecryptUpdateRequest | Multi-part decryption


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.decryptUpdate(keyId, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyId** | **String**| kid of security object | 
 **body** | [**DecryptUpdateRequest**](DecryptUpdateRequest.md)| Multi-part decryption | 

### Return type

[**DecryptUpdateResponse**](DecryptUpdateResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="decryptUpdateEx"></a>
# **decryptUpdateEx**
> DecryptUpdateResponse decryptUpdateEx(body)

Continue multi-part decryption

Continue a multi-part decryption operation. See &#x60;decrypt/init&#x60; for details. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.EncryptionAndDecryptionApi();

var body = new FortanixSdkmsRestApi.DecryptUpdateRequestEx(); // DecryptUpdateRequestEx | Multi-part decryption


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.decryptUpdateEx(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**DecryptUpdateRequestEx**](DecryptUpdateRequestEx.md)| Multi-part decryption | 

### Return type

[**DecryptUpdateResponse**](DecryptUpdateResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="encrypt"></a>
# **encrypt**
> EncryptResponse encrypt(keyId, body)

Encrypt data

Encrypt data using a symmetric or asymmetric key. &lt;br&gt; For symmetric ciphers, mode (specifying the block cipher mode) is a required field. &lt;br&gt; For GCM and CCM modes, tag_len is a required field. &lt;br&gt; iv is optional for symmetric ciphers and unused for asymmetric ciphers. If provided, it will be used as the cipher initialization value. Length of iv must match the initialization value size for the cipher and mode. If not provided, SDKMS will create a random iv of the correct length for the cipher and mode and return this value in the response. &lt;br&gt; Objects of type Opaque, EC, or HMAC may not be used for encryption or decryption. &lt;br&gt; 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.EncryptionAndDecryptionApi();

var keyId = "keyId_example"; // String | kid of security object

var body = new FortanixSdkmsRestApi.EncryptRequest(); // EncryptRequest | Encryption request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.encrypt(keyId, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyId** | **String**| kid of security object | 
 **body** | [**EncryptRequest**](EncryptRequest.md)| Encryption request | 

### Return type

[**EncryptResponse**](EncryptResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="encryptEx"></a>
# **encryptEx**
> EncryptResponse encryptEx(body)

Encrypt data

Encrypt data using a symmetric or asymmetric key. &lt;br&gt; For symmetric ciphers, mode (specifying the block cipher mode) is a required field. &lt;br&gt; For GCM and CCM modes, tag_len is a required field. &lt;br&gt; iv is optional for symmetric ciphers and unused for asymmetric ciphers. If provided, it will be used as the cipher initialization value. Length of iv must match the initialization value size for the cipher and mode. If not provided, SDKMS will create a random iv of the correct length for the cipher and mode and return this value in the response. &lt;br&gt; Objects of type Opaque, EC, or HMAC may not be used for encryption or decryption. &lt;br&gt; 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.EncryptionAndDecryptionApi();

var body = new FortanixSdkmsRestApi.EncryptRequestEx(); // EncryptRequestEx | Encryption request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.encryptEx(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**EncryptRequestEx**](EncryptRequestEx.md)| Encryption request | 

### Return type

[**EncryptResponse**](EncryptResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="encryptFinal"></a>
# **encryptFinal**
> EncryptFinalResponse encryptFinal(keyId, body)

Conclude multi-part encryption

Conclude a multi-part encryption operation. See &#x60;encrypt/init&#x60; for details. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.EncryptionAndDecryptionApi();

var keyId = "keyId_example"; // String | kid of security object

var body = new FortanixSdkmsRestApi.EncryptFinalRequest(); // EncryptFinalRequest | Finish multi-part encryption


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.encryptFinal(keyId, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyId** | **String**| kid of security object | 
 **body** | [**EncryptFinalRequest**](EncryptFinalRequest.md)| Finish multi-part encryption | 

### Return type

[**EncryptFinalResponse**](EncryptFinalResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="encryptFinalEx"></a>
# **encryptFinalEx**
> EncryptFinalResponse encryptFinalEx(body)

Conclude multi-part encryption

Conclude a multi-part encryption operation. See &#x60;encrypt/init&#x60; for details. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.EncryptionAndDecryptionApi();

var body = new FortanixSdkmsRestApi.EncryptFinalRequestEx(); // EncryptFinalRequestEx | Finish multi-part encryption


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.encryptFinalEx(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**EncryptFinalRequestEx**](EncryptFinalRequestEx.md)| Finish multi-part encryption | 

### Return type

[**EncryptFinalResponse**](EncryptFinalResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="encryptInit"></a>
# **encryptInit**
> EncryptInitResponse encryptInit(keyId, body)

Begin multi-part encryption

This API is used when encrypting more data than the client wishes to submit in a single request. It supports only symmetric ciphers and only conventional (not AEAD) modes of operation. To perform multi-part encryption, the client makes one request to the &#x60;init&#x60; resource, zero or more requests to the &#x60;update&#x60; resource, followed by one request to the &#x60;final&#x60; resource. The response to init and update requests includes a &#x60;state&#x60; field. The &#x60;state&#x60; is an opaque data blob that must be supplied unmodified by the client with the subsequent request. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.EncryptionAndDecryptionApi();

var keyId = "keyId_example"; // String | kid of security object

var body = new FortanixSdkmsRestApi.EncryptInitRequest(); // EncryptInitRequest | Multi-part encryption initialization request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.encryptInit(keyId, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyId** | **String**| kid of security object | 
 **body** | [**EncryptInitRequest**](EncryptInitRequest.md)| Multi-part encryption initialization request | 

### Return type

[**EncryptInitResponse**](EncryptInitResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="encryptInitEx"></a>
# **encryptInitEx**
> EncryptInitResponse encryptInitEx(body)

Begin multi-part encryption

This API is used when encrypting more data than the client wishes to submit in a single request. It supports only symmetric ciphers and only conventional (not AEAD) modes of operation. To perform multi-part encryption, the client makes one request to the &#x60;init&#x60; resource, zero or more requests to the &#x60;update&#x60; resource, followed by one request to the &#x60;final&#x60; resource. The response to init and update requests includes a &#x60;state&#x60; field. The &#x60;state&#x60; is an opaque data blob that must be supplied unmodified by the client with the subsequent request. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.EncryptionAndDecryptionApi();

var body = new FortanixSdkmsRestApi.EncryptInitRequestEx(); // EncryptInitRequestEx | Multi-part encryption initialization request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.encryptInitEx(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**EncryptInitRequestEx**](EncryptInitRequestEx.md)| Multi-part encryption initialization request | 

### Return type

[**EncryptInitResponse**](EncryptInitResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="encryptUpdate"></a>
# **encryptUpdate**
> EncryptUpdateResponse encryptUpdate(keyId, body)

Continue multi-part encryption

Continue a multi-part encryption operation. See &#x60;encrypt/init&#x60; for details. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.EncryptionAndDecryptionApi();

var keyId = "keyId_example"; // String | kid of security object

var body = new FortanixSdkmsRestApi.EncryptUpdateRequest(); // EncryptUpdateRequest | Multi-part encryption


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.encryptUpdate(keyId, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyId** | **String**| kid of security object | 
 **body** | [**EncryptUpdateRequest**](EncryptUpdateRequest.md)| Multi-part encryption | 

### Return type

[**EncryptUpdateResponse**](EncryptUpdateResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="encryptUpdateEx"></a>
# **encryptUpdateEx**
> EncryptUpdateResponse encryptUpdateEx(body)

Continue multi-part encryption

Continue a multi-part encryption operation. See &#x60;encrypt/init&#x60; for details. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.EncryptionAndDecryptionApi();

var body = new FortanixSdkmsRestApi.EncryptUpdateRequestEx(); // EncryptUpdateRequestEx | Multi-part encryption


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.encryptUpdateEx(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**EncryptUpdateRequestEx**](EncryptUpdateRequestEx.md)| Multi-part encryption | 

### Return type

[**EncryptUpdateResponse**](EncryptUpdateResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

