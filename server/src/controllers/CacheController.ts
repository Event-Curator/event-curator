import { eaCache } from '../middlewares/apiGateway.js';

const getDocumentById = async function (externalId: string) {
        
    let result = await eaCache.events.find({
        selector: {
            "externalId": {
                $eq: externalId
            }
        }
    }).exec();

    if (result && result.length === 1) {
      return result[0];
    
    } else {
      return [];
    }
};

export { getDocumentById };