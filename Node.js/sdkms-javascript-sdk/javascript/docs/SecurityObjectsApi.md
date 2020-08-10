# FortanixSdkmsRestApi.SecurityObjectsApi

All URIs are relative to *https://apps.smartkey.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**agreeKey**](SecurityObjectsApi.md#agreeKey) | **POST** /crypto/v1/agree | Agree on a key from two other keys
[**deletePrivateKey**](SecurityObjectsApi.md#deletePrivateKey) | **DELETE** /crypto/v1/keys/{key-id}/private | Remove / Destroy private half of the asymmetric key
[**deleteSecurityObject**](SecurityObjectsApi.md#deleteSecurityObject) | **DELETE** /crypto/v1/keys/{key-id} | Delete a security object
[**deriveKey**](SecurityObjectsApi.md#deriveKey) | **POST** /crypto/v1/keys/{key-id}/derive | Derive a key from another key
[**deriveKeyEx**](SecurityObjectsApi.md#deriveKeyEx) | **POST** /crypto/v1/derive | Derive a key from another key
[**generateSecurityObject**](SecurityObjectsApi.md#generateSecurityObject) | **POST** /crypto/v1/keys | Generate a new security object
[**getSecurityObject**](SecurityObjectsApi.md#getSecurityObject) | **GET** /crypto/v1/keys/{key-id} | Get a specific security object
[**getSecurityObjectDigest**](SecurityObjectsApi.md#getSecurityObjectDigest) | **POST** /crypto/v1/keys/digest | Retrieve the digest (hash) of the value of an exportable security object
[**getSecurityObjectValue**](SecurityObjectsApi.md#getSecurityObjectValue) | **GET** /crypto/v1/keys/{key-id}/export | Retrieve the value of an exportable security object
[**getSecurityObjectValueEx**](SecurityObjectsApi.md#getSecurityObjectValueEx) | **POST** /crypto/v1/keys/export | Retrieve the value of an exportable security object
[**getSecurityObjects**](SecurityObjectsApi.md#getSecurityObjects) | **GET** /crypto/v1/keys | Get all security objects
[**importSecurityObject**](SecurityObjectsApi.md#importSecurityObject) | **PUT** /crypto/v1/keys | Import a security object
[**persistSecurityObject**](SecurityObjectsApi.md#persistSecurityObject) | **POST** /crypto/v1/keys/persist | Persist a transient key.
[**updateSecurityObject**](SecurityObjectsApi.md#updateSecurityObject) | **PATCH** /crypto/v1/keys/{key-id} | Update a security object


<a name="agreeKey"></a>
# **agreeKey**
> KeyObject agreeKey(body)

Agree on a key from two other keys

This does a cryptographic key agreement operation between a public and private key. Both keys must have been generated from the same parameters (e.g. the same elliptic curve). Both keys must allow the AGREEKEY operation. The request body contains the requested properties for the new key as well as the mechanism (e.g. Diffie-Hellman) to be used to produce the key material for the new key. The output of this API should not be used directly as a cryptographic key. The target object type should be HMAC or Secret, and a key derivation procedure should be used to derive the actual key material. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.SecurityObjectsApi();

var body = new FortanixSdkmsRestApi.AgreeKeyRequest(); // AgreeKeyRequest | Template of the agreed-upon security object


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.agreeKey(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**AgreeKeyRequest**](AgreeKeyRequest.md)| Template of the agreed-upon security object | 

### Return type

[**KeyObject**](KeyObject.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="deletePrivateKey"></a>
# **deletePrivateKey**
> deletePrivateKey(keyId, )

Remove / Destroy private half of the asymmetric key

Removes the private portion of an asymmetric key from SDKMS. After this operation is performed, operations that require the private key, such as encryption and generating signatures, may no longer be performed. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.SecurityObjectsApi();

var keyId = "keyId_example"; // String | kid of security object


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.deletePrivateKey(keyId, , callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyId** | **String**| kid of security object | 

### Return type

null (empty response body)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="deleteSecurityObject"></a>
# **deleteSecurityObject**
> deleteSecurityObject(keyId, )

Delete a security object

Delete a specified security object.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.SecurityObjectsApi();

var keyId = "keyId_example"; // String | kid of security object


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.deleteSecurityObject(keyId, , callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyId** | **String**| kid of security object | 

### Return type

null (empty response body)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="deriveKey"></a>
# **deriveKey**
> KeyObject deriveKey(keyId, body)

Derive a key from another key

This derives a key from an existing key and returns the properties of the new key. The request body contains the requested properties for the new as well as the mechanism to be used to produce the key material for the new key. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.SecurityObjectsApi();

var keyId = "keyId_example"; // String | kid of security object

var body = new FortanixSdkmsRestApi.DeriveKeyRequest(); // DeriveKeyRequest | Name of security object


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.deriveKey(keyId, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyId** | **String**| kid of security object | 
 **body** | [**DeriveKeyRequest**](DeriveKeyRequest.md)| Name of security object | 

### Return type

[**KeyObject**](KeyObject.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="deriveKeyEx"></a>
# **deriveKeyEx**
> KeyObject deriveKeyEx(body)

Derive a key from another key

This derives a key from an existing key and returns the properties of the new key. The request body contains the requested properties for the new as well as the mechanism to be used to produce the key material for the new key. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.SecurityObjectsApi();

var body = new FortanixSdkmsRestApi.DeriveKeyRequestEx(); // DeriveKeyRequestEx | Name of security object


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.deriveKeyEx(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**DeriveKeyRequestEx**](DeriveKeyRequestEx.md)| Name of security object | 

### Return type

[**KeyObject**](KeyObject.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="generateSecurityObject"></a>
# **generateSecurityObject**
> KeyObject generateSecurityObject(body)

Generate a new security object

Generate a new security object (such as an RSA key pair or an AES key) of the requested size or elliptic curve. &lt;br&gt; By default, all key operations except for Export that are implemented for that type of key will be enabled. These may be overridden by requesting specific operations in the key creation request. &lt;br&gt; Objects of type Opaque may not be generated with this API. They must be imported via the importSecurityObject API. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.SecurityObjectsApi();

var body = new FortanixSdkmsRestApi.SobjectRequest(); // SobjectRequest | Request to create, update, or import security object


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.generateSecurityObject(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**SobjectRequest**](SobjectRequest.md)| Request to create, update, or import security object | 

### Return type

[**KeyObject**](KeyObject.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getSecurityObject"></a>
# **getSecurityObject**
> KeyObject getSecurityObject(keyId, )

Get a specific security object

Get the details of a particular security object. The query parameter &#x60;?view&#x3D;value&#x60; may be used to get the value of an opaque object or certificate directly as raw bytes. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.SecurityObjectsApi();

var keyId = "keyId_example"; // String | kid of security object


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getSecurityObject(keyId, , callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyId** | **String**| kid of security object | 

### Return type

[**KeyObject**](KeyObject.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getSecurityObjectDigest"></a>
# **getSecurityObjectDigest**
> DigestResponse getSecurityObjectDigest(body)

Retrieve the digest (hash) of the value of an exportable security object

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.SecurityObjectsApi();

var body = new FortanixSdkmsRestApi.ObjectDigestRequest(); // ObjectDigestRequest | Object digest request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getSecurityObjectDigest(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**ObjectDigestRequest**](ObjectDigestRequest.md)| Object digest request | 

### Return type

[**DigestResponse**](DigestResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getSecurityObjectValue"></a>
# **getSecurityObjectValue**
> KeyObject getSecurityObjectValue(keyId, )

Retrieve the value of an exportable security object

Get the details and value of a particular exportable security object. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.SecurityObjectsApi();

var keyId = "keyId_example"; // String | kid of security object


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getSecurityObjectValue(keyId, , callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyId** | **String**| kid of security object | 

### Return type

[**KeyObject**](KeyObject.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getSecurityObjectValueEx"></a>
# **getSecurityObjectValueEx**
> KeyObject getSecurityObjectValueEx(body)

Retrieve the value of an exportable security object

Get the details and value of a particular exportable security object. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.SecurityObjectsApi();

var body = new FortanixSdkmsRestApi.SobjectDescriptor(); // SobjectDescriptor | Request to export a security object


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getSecurityObjectValueEx(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**SobjectDescriptor**](SobjectDescriptor.md)| Request to export a security object | 

### Return type

[**KeyObject**](KeyObject.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getSecurityObjects"></a>
# **getSecurityObjects**
> [KeyObject] getSecurityObjects(opts)

Get all security objects

Return detailed information about the security objects stored in Fortanix SDKMS. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.SecurityObjectsApi();

var opts = { 
  'name': "name_example", // String | Only retrieve the security object with this name.
  'groupId': "groupId_example", // String | Only retrieve security objects in the specified group.
  'creator': "creator_example", // String | Only retrieve security objects created by the user or application with the specified id.
  'sort': "sort_example", // String | This specifies the property (`kid` or `name`) and order (ascending or descending) with which to sort the security objects. By default, security objects are sorted by `kid` in ascending order. The syntax is \"<property>:[asc|desc]\" (e.g. \"kid:desc\") or just \"<property>\" (ascending order by default). 
  'start': "start_example", // String | If provided, this must be a value of the property specified in `sort`. Returned security objects will begin just above or just below this value (for asc/desc order resp.). 
  'limit': 56, // Number | Maximum number of security objects to return. If not provided, the limit is 100.
  'offset': 56 // Number | Number of security objects past `start` to skip.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getSecurityObjects(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **name** | **String**| Only retrieve the security object with this name. | [optional] 
 **groupId** | **String**| Only retrieve security objects in the specified group. | [optional] 
 **creator** | **String**| Only retrieve security objects created by the user or application with the specified id. | [optional] 
 **sort** | **String**| This specifies the property (&#x60;kid&#x60; or &#x60;name&#x60;) and order (ascending or descending) with which to sort the security objects. By default, security objects are sorted by &#x60;kid&#x60; in ascending order. The syntax is \&quot;&lt;property&gt;:[asc|desc]\&quot; (e.g. \&quot;kid:desc\&quot;) or just \&quot;&lt;property&gt;\&quot; (ascending order by default).  | [optional] 
 **start** | **String**| If provided, this must be a value of the property specified in &#x60;sort&#x60;. Returned security objects will begin just above or just below this value (for asc/desc order resp.).  | [optional] 
 **limit** | **Number**| Maximum number of security objects to return. If not provided, the limit is 100. | [optional] 
 **offset** | **Number**| Number of security objects past &#x60;start&#x60; to skip. | [optional] 

### Return type

[**[KeyObject]**](KeyObject.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="importSecurityObject"></a>
# **importSecurityObject**
> KeyObject importSecurityObject(body)

Import a security object

Import a security object into SDKMS. &lt;br&gt; By default, all key operations except that are implemented for that type of key will be enabled. These may be overridden by requesting specific operations in the key import request. &lt;br&gt; For symmetric and asymmetric keys, value is base64-encoding of the key material in DER format. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.SecurityObjectsApi();

var body = new FortanixSdkmsRestApi.SobjectRequest(); // SobjectRequest | Request to create, update, or import security object


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.importSecurityObject(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**SobjectRequest**](SobjectRequest.md)| Request to create, update, or import security object | 

### Return type

[**KeyObject**](KeyObject.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="persistSecurityObject"></a>
# **persistSecurityObject**
> KeyObject persistSecurityObject(body)

Persist a transient key.

This API copies a transient key into a persisted security object in SDKMS. If the transient key&#39;s origin is \&quot;FortanixHSM\&quot;, the origin of the persisted key will be \&quot;Transient\&quot;. If the transient key&#39;s origin is \&quot;External\&quot;, the origin of the persisted key will be \&quot;External\&quot;. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.SecurityObjectsApi();

var body = new FortanixSdkmsRestApi.PersistTransientKeyRequest(); // PersistTransientKeyRequest | Persist transient key request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.persistSecurityObject(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**PersistTransientKeyRequest**](PersistTransientKeyRequest.md)| Persist transient key request | 

### Return type

[**KeyObject**](KeyObject.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="updateSecurityObject"></a>
# **updateSecurityObject**
> KeyObject updateSecurityObject(keyId, body)

Update a security object

Update the properties of a security object. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.SecurityObjectsApi();

var keyId = "keyId_example"; // String | kid of security object

var body = new FortanixSdkmsRestApi.SobjectRequest(); // SobjectRequest | Request to create, update, or import security object


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.updateSecurityObject(keyId, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyId** | **String**| kid of security object | 
 **body** | [**SobjectRequest**](SobjectRequest.md)| Request to create, update, or import security object | 

### Return type

[**KeyObject**](KeyObject.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

