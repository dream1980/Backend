# FortanixSdkmsRestApi.MacVerifyRequest

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**alg** | [**DigestAlgorithm**](DigestAlgorithm.md) |  | 
**data** | **Blob** | The data to verify the MAC of. | 
**digest** | **Blob** | The MAC previously computed for the input data. NOTE - this field is deprecated. Instead you should use mac field. | [optional] 
**mac** | **Blob** | The MAC previously computed for the input data. | [optional] 


