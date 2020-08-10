# FortanixSdkmsRestApi.User

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**userId** | **String** | User ID uniquely identifying this user. | 
**userEmail** | **String** | The User&#39;s email address. | 
**state** | [**UserState**](UserState.md) |  | 
**accountRole** | [**[UserAccountFlags]**](UserAccountFlags.md) |  | [optional] 
**groups** | [**UserAccountMap**](UserAccountMap.md) |  | 
**enabled** | **Boolean** | Whether this user&#39;s account is enabled. | 
**emailVerified** | **Boolean** | Whether this user&#39;s email has been verified. | 
**createdAt** | **String** | When this user was added to SDKMS. | 
**lastLoggedInAt** | **String** | When this user last logged in. | [optional] 
**u2fDevices** | [**[U2fDevice]**](U2fDevice.md) |  | 


