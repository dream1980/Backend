    var FortanixSdkmsRestApi = require('./src/index.js');

    function initialize() {
        var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;
        defaultClient.basePath= "https://apps.smartkey.io";
        var basicAuth = defaultClient.authentications['basicAuth'];
        //var apiKey = Base64.decode("");

        //var credential = apiKey.split(":");
        basicAuth.username = "";  
        basicAuth.password = "";
        return defaultClient;
    }

    //var tmp_access_token;

    var login = function(error, data, response) {
        //var bearerAuth = defaultClient.authentications['bearerToken'];
        //bearerAuth.apiKeyPrefix = "Bearer";
        //bearerAuth.apiKey = data["access_token"];
        //tmp_access_token = data["access_token"];

        
        console.log("print response");
        console.log(error);
        console.log(response);
        
    }
    
    defaultClient = initialize();
    var authenticationApi = new FortanixSdkmsRestApi.AuthenticationApi();
    authenticationApi.authorize(login);

    console.log("logged in finished");

    /*
    /// ******************
    /// create a key
    /// ******************

    var generateKeyCallback = function(error, data, response) {
        if (error) {
            console.error("Error: " + JSON.stringify(response));
        } else {
            console.log('Security Object Create: ' + JSON.stringify(data));
        }
    };
    
    
    var securityObjectApi = new FortanixSdkmsRestApi.SecurityObjectsApi()
    var securityObjectRequest = FortanixSdkmsRestApi.SobjectRequest.constructFromObject({"name": "test1", "key_size": 128, "obj_type": "AES"})
    securityObjectApi.generateSecurityObject(securityObjectRequest, generateKeyCallback);

    console.log("create a key finished");
    */