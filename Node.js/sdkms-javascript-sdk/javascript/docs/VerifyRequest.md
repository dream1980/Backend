# FortanixSdkmsRestApi.VerifyRequest

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**hashAlg** | [**DigestAlgorithm**](DigestAlgorithm.md) |  | 
**hash** | **Blob** | The hash of the data on which the signature is being verified. Exactly one of &#x60;hash&#x60; and &#x60;data&#x60; is required.  | [optional] 
**data** | **Blob** | The data on which the signature is being verified. Exactly one of &#x60;hash&#x60; and &#x60;data&#x60; is required. To reduce request size and avoid reaching the request size limit, prefer &#x60;hash&#x60;.  | [optional] 
**signature** | **Blob** | A signature created with the private key corresponding to this public key. | 
**mode** | [**SignatureMode**](SignatureMode.md) |  | [optional] 


