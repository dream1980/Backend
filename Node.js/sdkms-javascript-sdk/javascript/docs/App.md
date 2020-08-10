# FortanixSdkmsRestApi.App

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **String** | Name of the application. Application names must be unique within an account. | 
**appId** | **String** | Application ID uniquely identifying this application. | 
**authType** | [**AppAuthType**](AppAuthType.md) |  | 
**description** | **String** | Description of this application. | [optional] 
**_interface** | **String** | Interface used with this application (PKCS11, CNG, JCE, KMIP, etc.). | [optional] 
**acctId** | **String** | The account ID of the account that this application belongs to. | 
**groups** | **[String]** | An array of Security Group IDs. The application belongs to each Security Group in this array. | 
**defaultGroup** | **String** | The default group of this application. This is the group where security objects will be created by default by this application. | 
**enabled** | **Boolean** | Whether this application is enabled. | 
**appType** | **String** | The user-defined type of this application. | 
**regions** | **[String]** | The list of regions this application may run in. | 
**creator** | [**CreatorType**](CreatorType.md) |  | 
**createdAt** | **String** | When this application was created. | 
**lastusedAt** | **String** | When this application was last used. | [optional] 


