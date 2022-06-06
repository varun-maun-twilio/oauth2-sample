var axios = require("axios").default;

const auth0Path = Runtime.getFunctions()['util/auth0Util'].path;
const {getAuth0Token} = require(auth0Path);



const httpProxyRequest = async (options)=>{

    let optionsWithAuth = {
        ...options
    };

    if('basic'==process.env.IU_MIDDLEWARE_AUTH_MODE){
        optionsWithAuth.auth ={
            username:process.env.IU_BASIC_AUTH_USERNAME,
            password:process.env.IU_BASIC_AUTH_PASSWORD
        }
    }
    else  if('auth0'==process.env.IU_MIDDLEWARE_AUTH_MODE){

        const auth0AccessToken= await getAuth0Token();

        optionsWithAuth.headers = optionsWithAuth.headers || {};
        optionsWithAuth.headers['Authorization'] = `Bearer ${auth0AccessToken}`;
    }



return axios.request(optionsWithAuth)
}


module.exports = {
    httpProxyRequest
}
