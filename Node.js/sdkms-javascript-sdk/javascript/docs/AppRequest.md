# FortanixSdkmsRestApi.AppRequest

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **String** | Name of this application. Application names must be unique within an account. | 
**description** | **String** | Description of this application. | [optional] 
**addGroups** | **[String]** | An array of Security Group IDs to add to this application. | 
**delGroups** | **[String]** | An array of security group IDs to remove from this application. | [optional] 
**defaultGroup** | **String** | The default group of this application. This is the group where security objects will be created by default by this application. | 
**enabled** | **Boolean** | Whether this application is enabled | [optional] 
**appType** | **String** | The user-defined type of this application. | [optional] 
**credential** | [**AppCredential**](AppCredential.md) |  | [optional] 


