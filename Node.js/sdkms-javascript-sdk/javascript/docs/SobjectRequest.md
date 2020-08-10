# FortanixSdkmsRestApi.SobjectRequest

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **String** | Name of the security object to create or import. Security object names must be unique within an account. | 
**description** | **String** | Description of the security object to create or import. | [optional] 
**keySize** | **Number** | Size in bits (not bytes) of the security object to create or import. Required for symmetric keys. Deprecated for RSA keys, specify it in &#x60;RsaOptions&#x60; instead. | [optional] 
**pubExponent** | **Number** | For RSA keys only. Deprecated. Specify in &#x60;RsaOptions&#x60; instead. Public exponent to use when generating an RSA key. | [optional] 
**ellipticCurve** | [**EllipticCurve**](EllipticCurve.md) |  | [optional] 
**rsa** | [**RsaOptions**](RsaOptions.md) |  | [optional] 
**groupId** | **String** | Group ID (not name) of the security group that this security object should belong to. The user or application creating this security object must be a member of this group. If no group is specified, the default group for the user or application will be used.  | [optional] 
**objType** | [**ObjectType**](ObjectType.md) |  | 
**keyOps** | [**[KeyOperations]**](KeyOperations.md) | Optional array of key operations to be enabled for this security object. If this property is not provided, the SDKMS server will provide a default set of key operations. Note that if you provide an empty array, all key operations will be disabled.  | [optional] 
**customMetadata** | **{String: String}** | User-defined metadata for this key. Stored as key-value pairs. | [optional] 
**value** | **Blob** | When importing a security object, this field contains the binary contents to import. When creating a security object, this field is unused. The value of an OPAQUE or CERTIFICATE object is always returned. For other objects, the value is returned only with &#x60;/crypto/v1/keys/export&#x60; API (if the object is exportable).  | [optional] 
**enabled** | **Boolean** | Whether the new security object should be enabled. Disabled security objects may not perform cryptographic operations.  | [optional] 
**_transient** | **Boolean** | If this is true, SDKMS will create a transient key. | [optional] 


