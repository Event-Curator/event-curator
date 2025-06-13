import { addRxPlugin, RxReplicationPullStreamItem } from 'rxdb/plugins/core';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { createRxDatabase } from 'rxdb';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { getAjv } from 'rxdb/plugins/validate-ajv';
import { replicateRxCollection } from 'rxdb/plugins/replication';
import { Subject } from 'rxjs/internal/Subject';
import { doEventsRestore, doGeocodingRestore, doReverseGeocodingRestore } from '../utils/persistence.js';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';

let eaCache;

addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBUpdatePlugin);
const restoreEventStream$ = new Subject<RxReplicationPullStreamItem<any, any>>();
const restoreGeocodingStream$ = new Subject<RxReplicationPullStreamItem<any, any>>();
const restoreReverseGeocodingStream$ = new Subject<RxReplicationPullStreamItem<any, any>>();

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

        return !isNaN(Date.parse(dateTimeString));
    });

    let eventCache = await eaCache.addCollections({
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
                    placeSuburb: {
                        type: 'string'
                    },
                    placeCity: {
                        type: 'string'
                    },
                    placeProvince: {
                        type: 'string'
                    },
                    placeCountry: {
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
    
    const eventsReplicationState = replicateRxCollection({
        collection: eventCache.events,
        replicationIdentifier: 'events-replication',
        autoStart: true,
        retryTime: 10,
        pull: {
            stream$: restoreEventStream$.asObservable(),
            batchSize: 10000,
            handler: doEventsRestore as any,
        }
    });

    // from human-readable address to map coordinate
    // = MD5(placeFreeform.toLowercase())
    let geocodingCache = await eaCache.addCollections({
        geocoding: {
            schema: {
                version: 0,
                primaryKey: 'id',
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        maxLength: 32
                    },

                    lat: {
                        type: 'number'
                    },

                    long: {
                        type: 'number'
                    }
                },
                required: ['id', 'lat', 'long']
            }
        }
    });

    const geocodingReplicationState = replicateRxCollection({
        collection: geocodingCache.geocoding,
        replicationIdentifier: 'geocoding-replication',
        autoStart: true,
        retryTime: 10,
        pull: {
            stream$: restoreGeocodingStream$.asObservable(),
            batchSize: 10000,
            handler: doGeocodingRestore as any,
        }
    });

    // from human-readable address to map coordinate
    // = MD5(placeFreeform.toLowercase())
    let reverseGeocodingCache = await eaCache.addCollections({
        reverseGeocoding: {
            schema: {
                version: 0,
                primaryKey: 'id',
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        maxLength: 32
                    },
                    placeSuburb: {
                        type: 'string'
                    },
                    placeCity: {
                        type: 'string'
                    },
                    placeProvince: {
                        type: 'string'
                    },
                    placeCountry: {
                        type: 'string'
                    },
                },
                required: ['id']
            }
        }
    });

    const reverseGeocodingReplicationState = replicateRxCollection({
        collection: reverseGeocodingCache.reverseGeocoding,
        replicationIdentifier: 'reverse-geocoding-replication',
        autoStart: true,
        retryTime: 10,
        pull: {
            stream$: restoreReverseGeocodingStream$.asObservable(),
            batchSize: 10000,
            handler: doReverseGeocodingRestore as any,
        }
    });
}

export { initCache, eaCache, restoreEventStream$, restoreGeocodingStream$, restoreReverseGeocodingStream$ }
