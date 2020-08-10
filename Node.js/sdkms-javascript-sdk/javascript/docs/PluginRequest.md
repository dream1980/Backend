# FortanixSdkmsRestApi.PluginRequest

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **String** | Name of the plugin. Plugin names must be unique within an account. | 
**description** | **String** | Description of this plugin. | [optional] 
**addGroups** | **[String]** | An array of Security Group IDs to add to this plugin. | 
**delGroups** | **[String]** | An array of security group IDs to remove from this plugin. | [optional] 
**defaultGroup** | **String** | The default group of this plugin. This is the group where security objects will be created by default by this plugin. | 
**source** | [**PluginSource**](PluginSource.md) |  | 
**enabled** | **Boolean** | Whether this plugin is enabled. | [optional] 
**pluginType** | [**PluginType**](PluginType.md) |  | [optional] 


