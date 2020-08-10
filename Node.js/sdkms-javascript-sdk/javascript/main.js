var FortanixSdkmsRestApi = require('./src/index.js');
var btoa = require('btoa');

var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;
defaultClient.basePath="https://sdkms.fortanix.com"
var basicAuth = defaultClient.authentications['basicAuth'];
basicAuth.username = "" // AppID
basicAuth.password = "" // App Secret


var encryptionCallback = function(error, data, response) {
  if (error) {
    console.error("Error: " + JSON.stringify(response));
  } else {
    console.log('Data encrypted successfuly. result: ' + JSON.stringify(data));
  }
};

var createKeyCallback = function(error, data, response) {
  if (error) {
    console.error("Error: " + JSON.stringify(response));
  } else {
    console.log('Key created successfuly. KeyId: ' + data["kid"]);
    var encryptApi = new FortanixSdkmsRestApi.EncryptionAndDecryptionApi()
    var plaindata = btoa("Plain Data")
    var encryptRequest = FortanixSdkmsRestApi.EncryptRequest.constructFromObject({"alg" :"AES", "plain": plaindata, "mode": "CBC"})
    encryptApi.encrypt(data["kid"], encryptRequest, encryptionCallback)
  }
};

var authCallback = function(error, data, response) {
  if (error) {
    console.error("Error: " + JSON.stringify(response));
  } else {
    console.log('Auth successful. result: ' + JSON.stringify(data));
    var bearerAuth = defaultClient.authentications['bearerToken'];
    bearerAuth.apiKeyPrefix = "Bearer"
	bearerAuth.apiKey = data["access_token"]
	var soApi = new FortanixSdkmsRestApi.SecurityObjectsApi()
	var soRequest = FortanixSdkmsRestApi.SobjectRequest.constructFromObject({"name": "test-aes-key", "key_size": 128, "obj_type": "AES"})
	soApi.generateSecurityObject(soRequest, createKeyCallback);
  }
};

var authApi = new FortanixSdkmsRestApi.AuthenticationApi()
authApi.authorize(authCallback);
