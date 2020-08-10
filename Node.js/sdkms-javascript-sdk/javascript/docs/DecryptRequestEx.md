# FortanixSdkmsRestApi.DecryptRequestEx

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**key** | [**SobjectDescriptor**](SobjectDescriptor.md) |  | 
**alg** | [**ObjectType**](ObjectType.md) |  | [optional] 
**cipher** | **Blob** | The ciphertext to decrypt. | 
**mode** | [**CryptMode**](CryptMode.md) |  | [optional] 
**iv** | **Blob** | The initialization value used to encrypt this ciphertext. This field is required for symmetric ciphers, and ignored for asymmetric ciphers.  | [optional] 
**ad** | **Blob** | The authenticated data used with this ciphertext and authentication tag. This field is required for symmetric ciphers using cipher mode GCM or CCM, and must not be specified for all other ciphers.  | [optional] 
**tag** | **Blob** | The authentication tag used with this ciphertext and authenticated data. This field is required for symmetric ciphers using cipher mode GCM or CCM, and must not be specified for all other ciphers.  | [optional] 


