# FortanixSdkmsRestApi.Plugin

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **String** | Name of the plugin. Plugin names must be unique within an account. | 
**pluginId** | **String** | Plugin ID uniquely identifying this plugin. | 
**description** | **String** | Description of this plugin. | [optional] 
**acctId** | **String** | The account ID of the account that this plugin belongs to. | 
**groups** | **[String]** | An array of security group IDs. The plugin belongs to each Security Group in this array. | 
**defaultGroup** | **String** | The default group of this plugin. This is the group where security objects will be created by default by this plugin. | 
**source** | [**PluginSource**](PluginSource.md) |  | 
**enabled** | **Boolean** | Whether this plugin is enabled. | 
**pluginType** | [**PluginType**](PluginType.md) |  | 
**regions** | **[String]** | The list of regions this plugin may run in. | 
**creator** | [**CreatorType**](CreatorType.md) |  | 
**createdAt** | **String** | When this plugin was created. | 
**lastrunAt** | **String** | When this plugin was last run. | 
**lastupdatedAt** | **String** | When this plugin was last updated. | 


