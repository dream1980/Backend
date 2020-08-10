# FortanixSdkmsRestApi.RsaOptions

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**keySize** | **Number** | Specify on Create only. Returned on Get. Size in bits (not bytes) of the RSA key. | [optional] 
**publicExponent** | **Number** | Specify on Create only. Public exponent to use for generating the RSA key. | [optional] 
**encryptionPolicy** | [**[RsaEncryptionPolicy]**](RsaEncryptionPolicy.md) | Encryption policy for this RSA key. When doing an encryption or key wrapping operation, the policies are evaluated against the specified parameters one by one. If one matches, the operation is allowed. If none match, including if the policy list is empty, the operation is disallowed. Missing optional parameters will have their defaults specified according to the matched policy. The default for new keys is &#x60;[{\&quot;padding\&quot;:{\&quot;OAEP\&quot;:{}}]&#x60;. If (part of) a constraint is not specified, anything is allowed for that constraint. To impose no constraints, specify &#x60;[{}]&#x60;.  | 
**signaturePolicy** | [**[RsaSignaturePolicy]**](RsaSignaturePolicy.md) | Signature policy for this RSA key. When doing a signature operation, the policies are evaluated against the specified parameters one by one. If one matches, the operation is allowed. If none match, including if the policy list is empty, the operation is disallowed. Missing optional parameters will have their defaults specified according to the matched policy. The default for new keys is &#x60;[{}]&#x60; (no constraints). If (part of) a constraint is not specified, anything is allowed for that constraint.  | [optional] 


