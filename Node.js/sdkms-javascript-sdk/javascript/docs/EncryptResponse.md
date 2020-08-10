# FortanixSdkmsRestApi.EncryptResponse

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**kid** | **String** | ID of the key used to perform encryption. | [optional] 
**cipher** | **Blob** | The encrypted data. | 
**iv** | **Blob** | The initialiation value used for symmetric encryption. Not returned for asymmetric ciphers. | [optional] 
**tag** | **Blob** | For symmetric ciphers with cipher mode GCM or CCM, the authentication tag produced by the cipher. Its length will match the tag length specified by the encryption request.  | [optional] 


