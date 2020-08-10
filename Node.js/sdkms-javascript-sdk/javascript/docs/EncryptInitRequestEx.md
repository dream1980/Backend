# FortanixSdkmsRestApi.EncryptInitRequestEx

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**key** | [**SobjectDescriptor**](SobjectDescriptor.md) |  | 
**alg** | [**ObjectType**](ObjectType.md) |  | 
**mode** | [**CipherMode**](CipherMode.md) |  | [optional] 
**iv** | **Blob** | For symmetric ciphers, this value will be used for the cipher initialization value. If not provided, SDKMS will generate a random iv and return it in the response. If provided, iv length must match the length required by the cipher and mode.  | [optional] 


