# FortanixSdkmsRestApi.SignRequest

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**hashAlg** | [**DigestAlgorithm**](DigestAlgorithm.md) |  | 
**hash** | **Blob** | Hash of the data to be signed. Exactly one of &#x60;hash&#x60; and &#x60;data&#x60; is required.  | [optional] 
**data** | **Blob** | Data to be signed. Exactly one of &#x60;hash&#x60; and &#x60;data&#x60; is required. To reduce request size and avoid reaching the request size limit, prefer &#x60;hash&#x60;.  | [optional] 
**mode** | [**SignatureMode**](SignatureMode.md) |  | [optional] 


