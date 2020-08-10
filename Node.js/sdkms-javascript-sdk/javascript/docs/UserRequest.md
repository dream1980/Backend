# FortanixSdkmsRestApi.UserRequest

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**userEmail** | **String** | User&#39;s email address. | 
**userPassword** | **String** | The password to assign to this user in SDKMS. | 
**accountRole** | [**[UserAccountFlags]**](UserAccountFlags.md) |  | [optional] 
**addGroups** | [**[UserGroup]**](UserGroup.md) | The user will be added to security groups in this list. | [optional] 
**delGroups** | [**[UserGroup]**](UserGroup.md) | The User will be removed from security groups in this list. | [optional] 
**changeGroups** | [**[UserGroup]**](UserGroup.md) |  | [optional] 
**enabled** | **Boolean** | Whether this application is enabled. | [optional] 
**addU2fDevices** | [**[U2fAddDeviceRequest]**](U2fAddDeviceRequest.md) |  | [optional] 
**delU2fDevices** | [**[U2fDelDeviceRequest]**](U2fDelDeviceRequest.md) |  | [optional] 
**renameU2fDevices** | [**[U2fRenameDeviceRequest]**](U2fRenameDeviceRequest.md) |  | [optional] 


