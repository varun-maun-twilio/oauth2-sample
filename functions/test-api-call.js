console.error(Runtime.getFunctions());

const httpUtilPath = Runtime.getFunctions()['util/httpUtil'].path;
const { httpProxyRequest } = require(httpUtilPath);


exports.handler = async function(context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.appendHeader('Content-Type', 'application/json');

  const apiResponse= await httpProxyRequest({
    url:'https://test-endpoint.free.beeceptor.com',
    method:'POST',
    data: {
      firstName: 'FName1_1',
      lastName:'LName2'
    },
  })

  response.setBody({    
    responseData: apiResponse.data,
  });
  return callback(null, response);
};
