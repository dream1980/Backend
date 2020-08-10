# FortanixSdkmsRestApi.KeyObject

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **String** | Name of the security object. | 
**description** | **String** | Description of the security object. | [optional] 
**keySize** | **Number** | For objects which are not elliptic curves, this is the size in bits (not bytes) of the object. This field is not returned for elliptic curves.  | [optional] 
**ellipticCurve** | [**EllipticCurve**](EllipticCurve.md) |  | [optional] 
**acctId** | **String** | Account ID of the account this security object belongs to. | 
**groupId** | **String** | Group ID of the security group that this security object belongs to. | [optional] 
**creator** | [**CreatorType**](CreatorType.md) |  | 
**kid** | **String** | Key ID uniquely identifying this security object. | [optional] 
**objType** | [**ObjectType**](ObjectType.md) |  | 
**keyOps** | [**[KeyOperations]**](KeyOperations.md) | Array of key operations enabled for this security object.  | [optional] 
**customMetadata** | **{String: String}** | User-defined metadata for this key. Stored as key-value pairs. | [optional] 
**origin** | [**ObjectOrigin**](ObjectOrigin.md) |  | 
**pubKey** | **Blob** | This field is returned only for asymmetric keys. It contains the public key. | [optional] 
**value** | **Blob** | This field is returned only for opaque and secret objects. It contains the contents of the object. | [optional] 
**enabled** | **Boolean** | Whether this security object has cryptographic operations enabled. | 
**createdAt** | **String** | When this security object was created. | 
**lastusedAt** | **String** | When this security object was last used. | 
**transientKey** | **String** | Transient key blob. | [optional] 
**neverExportable** | **Boolean** | True if this key&#39;s operations have never contained EXPORT. | 


