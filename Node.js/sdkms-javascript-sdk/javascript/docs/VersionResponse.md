# FortanixSdkmsRestApi.VersionResponse

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**version** | **String** | The SDKMS server version. This is encoded as major.minor.build. For example, 1.0.25.  | 
**apiVersion** | **String** | The API version implemented by this server. | 
**serverMode** | [**ServerMode**](ServerMode.md) |  | 
**fipsLevel** | **Number** | FIPS level at which SDKMS in running. If this field is absent, then SDKMS is not running in FIPS compliant mode. | [optional] 


