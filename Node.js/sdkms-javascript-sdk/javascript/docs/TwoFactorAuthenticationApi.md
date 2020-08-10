# FortanixSdkmsRestApi.TwoFactorAuthenticationApi

All URIs are relative to *https://apps.smartkey.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**authorizeRecoveryCode**](TwoFactorAuthenticationApi.md#authorizeRecoveryCode) | **POST** /sys/v1/session/auth/2fa/recovery_code | Use a backup recovery code to complete authentication
[**authorizeU2F**](TwoFactorAuthenticationApi.md#authorizeU2F) | **POST** /sys/v1/session/auth/2fa/u2f | Use a U2F key to complete authentication
[**generateRecoveryCodes**](TwoFactorAuthenticationApi.md#generateRecoveryCodes) | **POST** /sys/v1/users/generate_recovery_code | Generate backup recovery codes for the current user
[**generateU2FChallenge**](TwoFactorAuthenticationApi.md#generateU2FChallenge) | **POST** /sys/v1/session/config_2fa/new_challenge | Generate a new challenge for registering a U2F devices
[**lock2F**](TwoFactorAuthenticationApi.md#lock2F) | **POST** /sys/v1/session/config_2fa/terminate | Lock two factor configuration


<a name="authorizeRecoveryCode"></a>
# **authorizeRecoveryCode**
> authorizeRecoveryCode()

Use a backup recovery code to complete authentication

Complete two factor authentication with a backup recovery code. The caller needs to provide a bearer token for the session in the request body. Each recovery code may only be used once, so users should update their two factor configuration after using this API. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.TwoFactorAuthenticationApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.authorizeRecoveryCode(callback);
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

<a name="authorizeU2F"></a>
# **authorizeU2F**
> authorizeU2F()

Use a U2F key to complete authentication

Complete two factor authentication with a U2F authentication token to authenticate to SDKMS. The response body contains a bearer authentication token which needs to be provided by subsequent calls for the duration of the session. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure HTTP basic authorization: basicAuth
var basicAuth = defaultClient.authentications['basicAuth'];
basicAuth.username = 'YOUR USERNAME';
basicAuth.password = 'YOUR PASSWORD';

var apiInstance = new FortanixSdkmsRestApi.TwoFactorAuthenticationApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.authorizeU2F(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

[basicAuth](../README.md#basicAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="generateRecoveryCodes"></a>
# **generateRecoveryCodes**
> RecoveryCodes generateRecoveryCodes()

Generate backup recovery codes for the current user

Generate backup recovery codes that may be used to complete complete two factor authentication. The caller needs to provide a bearer token for the session in the request body. Two factor configuration must be unlocked to use this API. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.TwoFactorAuthenticationApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.generateRecoveryCodes(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**RecoveryCodes**](RecoveryCodes.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="generateU2FChallenge"></a>
# **generateU2FChallenge**
> MfaChallenge generateU2FChallenge()

Generate a new challenge for registering a U2F devices

Generate a new challenge that may be used to register U2F devices. The caller needs to provide a bearer token for the session in the request body. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.TwoFactorAuthenticationApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.generateU2FChallenge(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**MfaChallenge**](MfaChallenge.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="lock2F"></a>
# **lock2F**
> lock2F()

Lock two factor configuration

Lock two factor configuration after completing two factor reconfiguration. The caller needs to provide a bearer token for the session in the request body. If this API is not called, two factor configuration will be locked automatically after ten minutes. 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.TwoFactorAuthenticationApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.lock2F(callback);
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

