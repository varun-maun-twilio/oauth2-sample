const twilio = require('twilio');
const client = new twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);


const fetchSyncDocument = (uniqueIdentifier)=>{

    const serviceSid = process.env.IU_SYNC_SERVICE_SID;

    return client.sync
        .services(serviceSid)
        .documents(uniqueIdentifier)
        .fetch()
        .then(document =>document.data)
        .catch((error) => null);
}


const createSyncDocument =(uniqueIdentifier,documentData)=>{

    const serviceSid = process.env.IU_SYNC_SERVICE_SID;

    return  client.sync.services(serviceSid).documents.create({
            uniqueName:uniqueIdentifier,
            data:documentData,
        })

}


const updateSyncDocument =(uniqueIdentifier,documentData)=>{

    const serviceSid = process.env.IU_SYNC_SERVICE_SID;

    return  client.sync.services(serviceSid).documents(uniqueIdentifier).update({data:documentData}).catch(e=>{
        createSyncDocument(uniqueIdentifier,documentData);
    });

}

const deleteSyncDocument =(uniqueIdentifier)=>{

    const serviceSid = process.env.IU_SYNC_SERVICE_SID;

    return  client.sync.services(serviceSid).documents(uniqueIdentifier).remove().catch(e=>{});

}


module.exports = {fetchSyncDocument,createSyncDocument,updateSyncDocument,deleteSyncDocument}