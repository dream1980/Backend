# FortanixSdkmsRestApi.WrapKeyRequest

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**alg** | [**ObjectType**](ObjectType.md) |  | 
**kid** | **String** | The key ID (not name or description) of the key being wrapped. | 
**mode** | [**CryptMode**](CryptMode.md) |  | [optional] 
**iv** | **Blob** | For symmetric ciphers, this value will be used for the cipher initialization value. If not provided, SDKMS will generate a random iv and return it in the response. If provided, iv length must match the length required by the cipher and mode.  | [optional] 
**ad** | **Blob** | For symmetric ciphers with cipher mode GCM or CCM, this optionally specifies the authenticated data used by the cipher. This field must not be provided with other cipher modes.  | [optional] 
**tagLen** | **Number** | For symmetric ciphers with cipher mode GCM or CCM, this field specifies the length of the authentication tag to be produced. This field is specified in bits (not bytes). This field is required for symmetric ciphers with cipher mode GCM or CCM. It must not be specified for asymmetric ciphers and symmetric ciphers with other cipher modes. | [optional] 


