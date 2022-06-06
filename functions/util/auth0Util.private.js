var axios = require("axios").default;
var moment = require('moment'); 

const syncPath = Runtime.getFunctions()['util/syncUtil'].path;
const { fetchSyncDocument,createSyncDocument,updateSyncDocument } = require(syncPath);


const SYNC_DOC_REF_IU_AUTH0_TOKEN='IU-CACHED-TOKEN';

/*

a. Read Access token from sync
b?. If token not available / token expired,
    b1.1 fetch new token
    b1.2 save token in sync
c. return access token

*/
const getAuth0Token = async ()=>{

   

    const cachedTokenData = await fetchSyncDocument(SYNC_DOC_REF_IU_AUTH0_TOKEN)

    
    
    let newTokenRequired = false;
    
    if(cachedTokenData==null || cachedTokenData.access_token==null){
        newTokenRequired = true;
    }
    else if(cachedTokenData.expires_at ==null || moment().isAfter(moment(cachedTokenData.expires_at))){
        newTokenRequired = true;
    }
    
    if(newTokenRequired==true){
        const newTokenResponse = await fetchNewAuth0Token();
        newTokenResponse.expires_at = moment().add(newTokenResponse.expires_in,'seconds').subtract(10,'minutes').valueOf();
        await updateSyncDocument(SYNC_DOC_REF_IU_AUTH0_TOKEN,newTokenResponse);
        return newTokenResponse.access_token;
    }else{
        return cachedTokenData.access_token;
    }
    






    

}


const fetchNewAuth0Token = async ()=>{
    var options = {
        method: 'POST',
        url: process.env.IU_AUTH0_TOKEN_URL,
       // headers: {'content-type': 'application/x-www-form-urlencoded'},
        data: {
          grant_type: 'client_credentials',
          client_id: process.env.IU_AUTH0_CLIENT_ID,
          client_secret: process.env.IU_AUTH0_CLIENT_SECRET,
          audience: process.env.IU_AUTH0_API_IDENTIFIER
        }
      };

      console.log(options,'--new token request');
      
    return await axios.request(options).then(r=>r.data).catch(e=>{ console.error(e); return {access_token:null}});
      
}




module.exports = {
    getAuth0Token
}
