# FortanixSdkmsRestApi.DeriveKeyRequest

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **String** | Name of the derived key. Key names must be unique within an account. | 
**groupId** | **String** | Group ID (not name) of the security group that this security object should belong to. The user or application creating this security object must be a member of this group. If no group is specified, the default group for the user or application will be used.  | [optional] 
**keySize** | **Number** | Key size of the derived key in bits (not bytes). | 
**keyType** | [**ObjectType**](ObjectType.md) |  | 
**mechanism** | [**DeriveKeyMechanism**](DeriveKeyMechanism.md) |  | 
**enabled** | **Boolean** | Whether the derived key should have cryptographic operations enabled. | [optional] 
**description** | **String** | Description for the new key. | [optional] 
**keyOps** | [**[KeyOperations]**](KeyOperations.md) | Optional array of key operations to be enabled for this security object. If this property is not provided, the SDKMS server will provide a default set of key operations. Note that if you provide an empty array, all key operations will be disabled.  | [optional] 
**customMetadata** | **{String: String}** | User-defined metadata for this key. Stored as key-value pairs. | [optional] 


