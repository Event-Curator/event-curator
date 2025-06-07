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

let eaCache;

addRxPlugin(RxDBDevModePlugin);

async function initCache() {

    // function myOwnHashFunction(input: string) {
    //     return Promise.resolve(md5(input));
    // }

    eaCache = await createRxDatabase({
        name: 'eventAggregator',
        // hashFunction: myOwnHashFunction,
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

   let testEvent = [
        {
        //    assumedMasterState: undefined,
        //     newDocumentState: {
            id: 'ed399f4d394dddc4e6be424dc43d0617',
            externalId: 'ed399f4d394dddc4e6be424dc43d0617',
            originId: 'ed399f4d394dddc4e6be424dc43d0617',
            originUrl: 'https://japancheapo.com/events/suwa-onbashira-festival/',
            name: 'Suwa Onbashira Festival',
            description: "Japan's most dangerous festival — several participants don't make it back home...",
            teaserText: '',
            teaserMedia: 'https://cdn.cheapoguides.com/wp-content/uploads/sites/3/2015/01/4264029250_4416674903_o-362x193.jpg',
            teaserFreeform: '',
            placeLattitude: 0,
            placeLongitude: 0,
            placeFreeform: 'Nagano',
            budgetMin: 0,
            budgetMax: 0,
            budgetCurrency: 'YEN',
            budgetFreeform: 'Free',
            datetimeFrom: '2025-06-06T14:05:36.207Z',
            datetimeTo: '2025-06-06T14:05:36.207Z',
            datetimeFreeform: '',
            category: EventCategoryEnum.BUSINESS, //'Other',
            categoryFreeform: 'Matsuri',
            size: EventSizeEnum.M, //'M',
            sizeFreeform: '',
            // _deleted: false,
            // BROL: "BROL"
            // }
        },
        {
        //    assumedMasterState: undefined,
        //     newDocumentState: {
            id: 'ed399f4d394dddc4e6be424dc43d0618',
            externalId: 'ed399f4d394dddc4e6be424dc43d0617',
            originId: 'ed399f4d394dddc4e6be424dc43d0617',
            originUrl: 'https://japancheapo.com/events/suwa-onbashira-festival/',
            name: 'Suwa Onbashira Festival2',
            description: "Japan's most dangerous festival — several participants don't make it back home...",
            teaserText: '',
            teaserMedia: 'https://cdn.cheapoguides.com/wp-content/uploads/sites/3/2015/01/4264029250_4416674903_o-362x193.jpg',
            teaserFreeform: '',
            placeLattitude: 0,
            placeLongitude: 0,
            placeFreeform: 'Nagano',
            budgetMin: 0,
            budgetMax: 0,
            budgetCurrency: 'YEN',
            budgetFreeform: 'Free',
            datetimeFrom: '2025-06-06T14:05:36.207Z',
            datetimeTo: '2025-06-06T14:05:36.207Z',
            datetimeFreeform: '',
            category: EventCategoryEnum.BUSINESS, //'Other',
            categoryFreeform: 'Matsuri',
            size: EventSizeEnum.M, //'M',
            sizeFreeform: '',
            // _deleted: false,
            // BROL: "BROL"
            // }
        }
    ]

    // const pullStream$ = new Subject<RxReplicationPullStreamItem<RxBlockDocument, CheckpointType>>();
    const pullStream$ = new Subject<RxReplicationPullStreamItem<any, any>>();

    const replicationState = replicateRxCollection({
        collection: myCollection.events,
        replicationIdentifier: 'my-http-replication',
        autoStart: true,
        retryTime: 10,
        // deletedField: "archived",

        push: { 
            async handler(changeRows){
                console.log("PUSH handler: ", changeRows);
                return [];
            }
        },
        pull: {
            stream$: pullStream$.asObservable(),
            batchSize: 10,
            handler: pullHandler as any,
        }
    });

    function pullHandler(checkpointOrNull: any, batchSize) {
        // try {
        // pull: { 
        //     async handler(checkpointOrNull: any, batchSize) {
        //         // if checkpoint is undefined => full sync, otherwise, nothing ?
        //         console.log("PULL handler:" + checkpointOrNull + "/" + batchSize);
        //         // const updatedAt = checkpointOrNull ? checkpointOrNull.updatedAt : 0;
        //         // const id = checkpointOrNull ? checkpointOrNull.id : '';
        //         // const response = await fetch(
        //         //     `http://localhost:3000pull?updatedAt=${updatedAt}&id=${id}&limit=${batchSize}`
        //         // );
        //         // const data = {documents: testEvent, checkpoint: { id: "ed399f4d394dddc4e6be424dc43d0617" } }
                const data = fakePull("ed399f4d394dddc4e6be424dc43d0617");
                console.log("handling a pullhandler request. checkpoint is: " + checkpointOrNull);
                return {
                    documents: data.documents,
                    checkpoint: data.checkpoint,
                    hasMoreDocuments: false
                };
        // } catch (e) {
        //     console.error("Oops" + e);
        // }
        //     }
        }


    setInterval( () => {
        // console.log(replicationState.internalReplicationState);
        const data = fakePull("ed399f4d394dddc4e6be424dc43d0617");
        pullStream$.next("RESYNC");

        // pullStream$.next({
        //     checkpoint: {
        //     id: "ed399f4d394dddc4e6be424dc43d0617",
        //     // updated: doc.updated,
        //     },
        //     documents: data.documents
        // });
    }, 2*1000);

    function fakePull(id: string) {
        const documents = testEvent;
        const newCheckpoint = documents.length === 0 ? { id } : {
            id: documents[1].id,
        };
        return { documents: documents, checkpoint: newCheckpoint };
    }
    
}

export { initCache, eaCache }