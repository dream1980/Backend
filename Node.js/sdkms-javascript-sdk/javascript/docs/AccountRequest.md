# FortanixSdkmsRestApi.AccountRequest

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **String** | Name of the account. Accounts must be unique within an SDKMS instance. | [optional] 
**description** | **String** | Account ID uniquely identifying this account. | [optional] 
**organization** | **String** | Organization (e.g. company name) that owns this account | [optional] 
**country** | **String** | Main country associated with this account | [optional] 
**phone** | **String** | Contact phone number associated with this account | [optional] 
**notificationPref** | [**NotificationPref**](NotificationPref.md) |  | [optional] 
**authConfig** | [**AuthConfig**](AuthConfig.md) |  | [optional] 
**addLoggingConfigs** | [**[LoggingConfigRequest]**](LoggingConfigRequest.md) |  | [optional] 
**modLoggingConfigs** | [**{String: LoggingConfigRequest}**](LoggingConfigRequest.md) | Map from UUIDs to LoggingConfigRequest objects | [optional] 
**delLoggingConfigs** | **[String]** |  | [optional] 
**pendingSubscriptionChangeRequest** | [**SubscriptionChangeRequest**](SubscriptionChangeRequest.md) |  | [optional] 
**enabled** | **Boolean** | Whether this account is enabled. This may only be changed by sysadmins. | [optional] 
**subscription** | [**SubscriptionType**](SubscriptionType.md) |  | [optional] 
**customMetadata** | **{String: String}** | Sysadmin-defined metadata for this account. Stored as key-value pairs. This field may only be used by sysadmin users.  | [optional] 


