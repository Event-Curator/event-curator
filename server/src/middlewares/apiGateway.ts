import { addRxPlugin, RxReplicationPullStreamItem } from 'rxdb/plugins/core';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { createRxDatabase } from 'rxdb';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { getAjv } from 'rxdb/plugins/validate-ajv';
import { replicateRxCollection } from 'rxdb/plugins/replication';
import md5 from 'md5';
import { Event, EventCategoryEnum, EventSizeEnum } from '../models/Event.js';
import { Subject } from 'rxjs/internal/Subject';
import { restoreEventHandler } from '../utils/persistance.js';

let eaCache;

addRxPlugin(RxDBDevModePlugin);

const restoreEventStream$ = new Subject<RxReplicationPullStreamItem<any, any>>();

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

    let myCollection = await eaCache.addCollections({
        events: {
            schema: {
                version: 0,
                primaryKey: 'id',
                type: 'object',
                properties: {
                    // FIXME: should be something else
                    id: {
                        type: 'string',
                        maxLength: 100
                    },
                    externalId: {
                        type: 'string'
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
    
    const replicationState = replicateRxCollection({
        collection: myCollection.events,
        replicationIdentifier: 'my-http-replication',
        autoStart: true,
        retryTime: 10,
        pull: {
            stream$: restoreEventStream$.asObservable(),
            batchSize: 10000,
            handler: restoreEventHandler as any,
        }
    });
}

export { initCache, eaCache, restoreEventStream$ }