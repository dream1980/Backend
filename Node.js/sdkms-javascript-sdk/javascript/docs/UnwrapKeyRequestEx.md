# FortanixSdkmsRestApi.UnwrapKeyRequestEx

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**key** | [**SobjectDescriptor**](SobjectDescriptor.md) |  | 
**alg** | [**ObjectType**](ObjectType.md) |  | 
**groupId** | **String** | Group ID (not name) of the security group that this security object should belong to. The user or application creating this security object must be a member of this group. If no group is specified, the default group for the user or application will be used.  | [optional] 
**objType** | [**ObjectType**](ObjectType.md) |  | 
**wrappedKey** | **Blob** | A Security Object previously wrapped with another key.  | 
**mode** | [**CryptMode**](CryptMode.md) |  | [optional] 
**iv** | **Blob** | The initialization value used to encrypt this ciphertext. This field is required for symmetric ciphers, and ignored for asymmetric ciphers.  | [optional] 
**ad** | **Blob** | The authenticated data used with this ciphertext and authentication tag. This field is required for symmetric ciphers using cipher mode GCM or CCM, and must not be specified for all other ciphers.  | [optional] 
**tag** | **Blob** | The authentication tag used with this ciphertext and authenticated data. This field is required for symmetric ciphers using cipher mode GCM or CCM, and must not be specified for all other ciphers.  | [optional] 
**name** | **String** | Name of the security object to unwrap. Security object names must be unique within an account. | 
**description** | **String** | Description of the Security object to unwrap. | [optional] 
**keyOps** | [**[KeyOperations]**](KeyOperations.md) | Optional array of key operations to be enabled for this security object. If this property is not provided, the SDKMS server will provide a default set of key operations. Note that if you provide an empty array, all key operations will be disabled.  | [optional] 
**customMetadata** | **{String: String}** | User-defined metadata for this key. Stored as key-value pairs. | [optional] 
**enabled** | **Boolean** | Whether the new security object should be enabled. Disabled security objects may not perform cryptographic operations.  | [optional] 
**rsa** | [**RsaOptions**](RsaOptions.md) |  | [optional] 


