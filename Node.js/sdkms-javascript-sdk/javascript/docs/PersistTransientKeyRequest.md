# FortanixSdkmsRestApi.PersistTransientKeyRequest

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **String** | Name of the persisted security object. Security object names must be unique within an account. | 
**description** | **String** | Description of the persisted security object. | [optional] 
**customMetadata** | **{String: String}** | User-defined metadata for the persisted key. Stored as key-value pairs. | [optional] 
**enabled** | **Boolean** | Whether the new security object should be enabled. Disabled security objects may not perform cryptographic operations.  | [optional] 
**keyOps** | [**[KeyOperations]**](KeyOperations.md) | Optional array of key operations to be enabled for this security object. If this property is not provided, the SDKMS server will provide a default set of key operations. Note that if you provide an empty array, all key operations will be disabled.  | [optional] 
**groupId** | **String** | Group ID (not name) of the security group that the persisted security object should belong to. The user or application creating this security object must be a member of this group. If no group is specified, the default group for the user or application will be used.  | [optional] 
**transientKey** | **String** | Transient key blob. | 


