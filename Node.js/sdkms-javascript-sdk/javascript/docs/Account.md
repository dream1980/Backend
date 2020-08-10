# FortanixSdkmsRestApi.Account

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **String** | Name of the account. Account names must be unique within an SDKMS instance. | 
**acctId** | **String** | Account ID uniquely identifying this account. | 
**description** | **String** | Description of this account. | [optional] 
**organization** | **String** | Organization (e.g. company name) that owns this account | [optional] 
**country** | **String** | Main country associated with this account | [optional] 
**phone** | **String** | Contact phone number associated with this account | [optional] 
**notificationPref** | [**NotificationPref**](NotificationPref.md) |  | [optional] 
**authConfig** | [**AuthConfig**](AuthConfig.md) |  | [optional] 
**subscription** | [**SubscriptionType**](SubscriptionType.md) |  | 
**state** | [**AccountState**](AccountState.md) |  | 
**authType** | [**AuthType**](AuthType.md) |  | 
**loggingConfigs** | [**{String: LoggingConfig}**](LoggingConfig.md) | Map from UUIDs to LoggingConfig objects | [optional] 
**enabled** | **Boolean** | Whether this account is enabled. This may only be changed by sysadmins. | [optional] 
**createdAt** | **String** | When this account was created. | [optional] 
**initialPurchaseAt** | **String** | When this accout was upgraded a paid subscription. | [optional] 
**pendingSubscriptionChangeRequest** | [**SubscriptionChangeRequest**](SubscriptionChangeRequest.md) |  | [optional] 
**customMetadata** | **{String: String}** | Sysadmin-defined metadata for this account. Stored as key-value pairs. This field is only visible to sysadmin users.  | [optional] 


