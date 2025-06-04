import { addRxPlugin } from 'rxdb/plugins/core';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { createRxDatabase } from 'rxdb';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { getAjv } from 'rxdb/plugins/validate-ajv';

let eaCache;

addRxPlugin(RxDBDevModePlugin);

async function initCache() {
    eaCache = await createRxDatabase({
        name: 'eventAggregator',
        storage: wrappedValidateAjvStorage({
            storage: getRxStorageMemory()
        })
    });

    const ajv = getAjv();

    // ajv.addFormat('email', {
    //     type: 'string',
    //     validate: v => v.includes('@') // ensure email fields contain the @ symbol
    // });

    ajv.addFormat('custom-date-time', function(dateTimeString: string): boolean {
        if (typeof dateTimeString === 'object') {
            dateTimeString = new Date(dateTimeString).toISOString();
        }

        return !isNaN(Date.parse(dateTimeString));  // any test that returns true/false 
    });

    await eaCache.addCollections({
        events: {
            schema: {
                version: 0,
                primaryKey: 'externalId',
                type: 'object',
                properties: {
                    // FIXME: should be something else
                    id: {
                        type: 'string'
                    },
                    externalId: {
                        type: 'string',
                        maxLength: 100
                    },

                    originId: {
                        type: 'string'
                    },
                    originUrl: {
                        type: 'string'
                    },

                    name: {
                        type: 'string'
                    },
                    description: {
                        type: 'string'
                    },
                    
                    teaserText: {
                        type: 'string'
                    },
                    teaserMedia: {
                        type: 'string'
                    },
                    teaserFreeform: {
                        type: 'string'
                    },

                    placeLattitude: {
                        type: 'number'
                    },
                    placeLongitude: {
                        type: 'number'
                    },
                    placeFreeform: {
                        type: 'string'
                    },

                    budgetMin: {
                        type: 'number'
                    },
                    budgetMax: {
                        type: 'number'
                    },
                    budgetCurrency: {
                        type: 'string'
                    },
                    budgetFreeform: {
                        type: 'string'
                    },

                    datetimeFrom: {
                        type: 'string',
                        format: 'custom-date-time'
                    },
                    datetimeTo: {
                        type: 'string',
                        format: 'custom-date-time'
                    },
                    datetimeFreeform: {
                        type: 'string',
                    },

                    category: {
                        type: 'string'
                    },
                    categoryFreeform: {
                        type: 'string'
                    },

                    size: {
                        type: 'string'
                    },
                    sizeFreeform: {
                        type: 'string'
                    },
                },
                required: ['id', 'externalId', 'name']
            }
        }
    });

}

export { initCache, eaCache }