# FortanixSdkmsRestApi.UsersApi

All URIs are relative to *https://apps.smartkey.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**changePassword**](UsersApi.md#changePassword) | **POST** /sys/v1/users/change_password | Change user password
[**confirmEmail**](UsersApi.md#confirmEmail) | **POST** /sys/v1/users/{user-id}/confirm_email | Confirms user&#39;s email address
[**createUser**](UsersApi.md#createUser) | **POST** /sys/v1/users | Create a new user
[**deleteUser**](UsersApi.md#deleteUser) | **DELETE** /sys/v1/users/{user-id}/account | Removed user&#39;s association with an account
[**deleteUserAccount**](UsersApi.md#deleteUserAccount) | **DELETE** /sys/v1/users | Completely delete a user profile from system
[**forgotPassword**](UsersApi.md#forgotPassword) | **POST** /sys/v1/users/forgot_password | Initiate password reset sequence for a user
[**getUser**](UsersApi.md#getUser) | **GET** /sys/v1/users/{user-id} | Get a specific user
[**getUserAccount**](UsersApi.md#getUserAccount) | **GET** /sys/v1/users/accounts | Get account information for the user
[**getUsers**](UsersApi.md#getUsers) | **GET** /sys/v1/users | Get all users
[**inviteUser**](UsersApi.md#inviteUser) | **POST** /sys/v1/users/invite | Invite a user
[**processInvitations**](UsersApi.md#processInvitations) | **POST** /sys/v1/users/process_invite | Process a user&#39;s pending account invitations
[**resendConfirmEmail**](UsersApi.md#resendConfirmEmail) | **POST** /sys/v1/users/{user-id}/resend_confirm_email | Resend email with link to confirm user&#39;s email address
[**resendInvitation**](UsersApi.md#resendInvitation) | **POST** /sys/v1/users/{user-id}/resend_invite | Resend invite to the user to join a specific account
[**resetPassword**](UsersApi.md#resetPassword) | **POST** /sys/v1/users/{user-id}/reset_password | Reset a user&#39;s password
[**updateUser**](UsersApi.md#updateUser) | **PATCH** /sys/v1/users/{user-id} | Update user
[**validatePasswordResetToken**](UsersApi.md#validatePasswordResetToken) | **POST** /sys/v1/users/{user-id}/validate_token | Validates password reset token for the user


<a name="changePassword"></a>
# **changePassword**
> changePassword(body)

Change user password

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.UsersApi();

var body = new FortanixSdkmsRestApi.PasswordChangeRequest(); // PasswordChangeRequest | Password change request


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.changePassword(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**PasswordChangeRequest**](PasswordChangeRequest.md)| Password change request | 

### Return type

null (empty response body)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="confirmEmail"></a>
# **confirmEmail**
> ConfirmEmailResponse confirmEmail(userIdbody)

Confirms user&#39;s email address

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.UsersApi();

var userId = "userId_example"; // String | User Identifier

var body = new FortanixSdkmsRestApi.ConfirmEmailRequest(); // ConfirmEmailRequest | Validate user's email


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.confirmEmail(userIdbody, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **String**| User Identifier | 
 **body** | [**ConfirmEmailRequest**](ConfirmEmailRequest.md)| Validate user&#39;s email | 

### Return type

[**ConfirmEmailResponse**](ConfirmEmailResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="createUser"></a>
# **createUser**
> User createUser(body)

Create a new user

Signs up a new user.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.UsersApi();

var body = new FortanixSdkmsRestApi.SignupRequest(); // SignupRequest | Email address of user


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.createUser(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**SignupRequest**](SignupRequest.md)| Email address of user | 

### Return type

[**User**](User.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="deleteUser"></a>
# **deleteUser**
> deleteUser(userId)

Removed user&#39;s association with an account

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.UsersApi();

var userId = "userId_example"; // String | User Identifier


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.deleteUser(userId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **String**| User Identifier | 

### Return type

null (empty response body)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="deleteUserAccount"></a>
# **deleteUserAccount**
> deleteUserAccount()

Completely delete a user profile from system

Completely deletes the currently logged in user from the system.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.UsersApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.deleteUserAccount(callback);
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

<a name="forgotPassword"></a>
# **forgotPassword**
> forgotPassword(body)

Initiate password reset sequence for a user

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.UsersApi();

var body = new FortanixSdkmsRestApi.ForgotPasswordRequest(); // ForgotPasswordRequest | Initiate forgot password sequrence


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.forgotPassword(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**ForgotPasswordRequest**](ForgotPasswordRequest.md)| Initiate forgot password sequrence | 

### Return type

null (empty response body)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUser"></a>
# **getUser**
> User getUser(userId)

Get a specific user

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.UsersApi();

var userId = "userId_example"; // String | User Identifier


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getUser(userId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **String**| User Identifier | 

### Return type

[**User**](User.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUserAccount"></a>
# **getUserAccount**
> UserAccountMap getUserAccount()

Get account information for the user

Obtain the current user&#39;s account information.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.UsersApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getUserAccount(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**UserAccountMap**](UserAccountMap.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUsers"></a>
# **getUsers**
> [User] getUsers(opts)

Get all users

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.UsersApi();

var opts = { 
  'groupId': "groupId_example", // String | Only retrieve users in the specified group.
  'sort': "sort_example", // String | This specifies the property (`user_id` only, for now) and order (ascending or descending) with which to sort the users. By default, users are sorted by `user_id` in ascending order. The syntax is \"<property>:[asc|desc]\" (e.g. \"user_id:desc\") or just \"<property>\" (ascending order by default). 
  'start': "start_example", // String | If provided, this must be a value of the property specified in `sort`. Returned users will begin just above or just below this value (for asc/desc order resp.). 
  'limit': 56, // Number | Maximum number of users to return. If not provided, the limit is 100.
  'offset': 56 // Number | Number of users past `start` to skip.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getUsers(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **groupId** | **String**| Only retrieve users in the specified group. | [optional] 
 **sort** | **String**| This specifies the property (&#x60;user_id&#x60; only, for now) and order (ascending or descending) with which to sort the users. By default, users are sorted by &#x60;user_id&#x60; in ascending order. The syntax is \&quot;&lt;property&gt;:[asc|desc]\&quot; (e.g. \&quot;user_id:desc\&quot;) or just \&quot;&lt;property&gt;\&quot; (ascending order by default).  | [optional] 
 **start** | **String**| If provided, this must be a value of the property specified in &#x60;sort&#x60;. Returned users will begin just above or just below this value (for asc/desc order resp.).  | [optional] 
 **limit** | **Number**| Maximum number of users to return. If not provided, the limit is 100. | [optional] 
 **offset** | **Number**| Number of users past &#x60;start&#x60; to skip. | [optional] 

### Return type

[**[User]**](User.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="inviteUser"></a>
# **inviteUser**
> User inviteUser(body)

Invite a user

Invite an existing user or new user to join an existing account. Only user email is required for invite API 

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.UsersApi();

var body = new FortanixSdkmsRestApi.UserRequest(); // UserRequest | Name of user


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.inviteUser(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**UserRequest**](UserRequest.md)| Name of user | 

### Return type

[**User**](User.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="processInvitations"></a>
# **processInvitations**
> processInvitations(body)

Process a user&#39;s pending account invitations

Process a user&#39;s pending invitations. It does both accepts and rejects.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.UsersApi();

var body = new FortanixSdkmsRestApi.ProcessInviteRequest(); // ProcessInviteRequest | Process account invitation (both accetps and rejects)


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.processInvitations(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**ProcessInviteRequest**](ProcessInviteRequest.md)| Process account invitation (both accetps and rejects) | 

### Return type

null (empty response body)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="resendConfirmEmail"></a>
# **resendConfirmEmail**
> resendConfirmEmail(userId)

Resend email with link to confirm user&#39;s email address

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.UsersApi();

var userId = "userId_example"; // String | User Identifier


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.resendConfirmEmail(userId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **String**| User Identifier | 

### Return type

null (empty response body)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="resendInvitation"></a>
# **resendInvitation**
> resendInvitation(userId)

Resend invite to the user to join a specific account

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.UsersApi();

var userId = "userId_example"; // String | User Identifier


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.resendInvitation(userId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **String**| User Identifier | 

### Return type

null (empty response body)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="resetPassword"></a>
# **resetPassword**
> resetPassword(userIdbody)

Reset a user&#39;s password

Resetting a user&#39;s password. User must have a valid reset token from forgot password step.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.UsersApi();

var userId = "userId_example"; // String | User Identifier

var body = new FortanixSdkmsRestApi.PasswordResetRequest(); // PasswordResetRequest | Reset password


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.resetPassword(userIdbody, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **String**| User Identifier | 
 **body** | [**PasswordResetRequest**](PasswordResetRequest.md)| Reset password | 

### Return type

null (empty response body)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="updateUser"></a>
# **updateUser**
> User updateUser(userIdbody)

Update user

Change a user&#39;s properties.

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.UsersApi();

var userId = "userId_example"; // String | User Identifier

var body = new FortanixSdkmsRestApi.UserRequest(); // UserRequest | Name of user


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.updateUser(userIdbody, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **String**| User Identifier | 
 **body** | [**UserRequest**](UserRequest.md)| Name of user | 

### Return type

[**User**](User.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="validatePasswordResetToken"></a>
# **validatePasswordResetToken**
> ValidateTokenResponse validatePasswordResetToken(userIdbody)

Validates password reset token for the user

### Example
```javascript
var FortanixSdkmsRestApi = require('fortanix_sdkms_rest_api');
var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;

// Configure API key authorization: bearerToken
var bearerToken = defaultClient.authentications['bearerToken'];
bearerToken.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearerToken.apiKeyPrefix = 'Token';

var apiInstance = new FortanixSdkmsRestApi.UsersApi();

var userId = "userId_example"; // String | User Identifier

var body = new FortanixSdkmsRestApi.ValidateTokenRequest(); // ValidateTokenRequest | Validate token


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.validatePasswordResetToken(userIdbody, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **String**| User Identifier | 
 **body** | [**ValidateTokenRequest**](ValidateTokenRequest.md)| Validate token | 

### Return type

[**ValidateTokenResponse**](ValidateTokenResponse.md)

### Authorization

[bearerToken](../README.md#bearerToken)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

