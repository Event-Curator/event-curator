import { addRxPlugin } from 'rxdb/plugins/core';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { createRxDatabase } from 'rxdb';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

let eaCache;

addRxPlugin(RxDBDevModePlugin);

async function initCache() {
    eaCache = await createRxDatabase({
        name: 'eventAggregator',
        storage: wrappedValidateAjvStorage({
            storage: getRxStorageMemory()
        })
    });

    await eaCache.addCollections({
        // name of the collection
        events: {
            // we use the JSON-schema standard
            schema: {
                version: 0,
                primaryKey: 'id',
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        maxLength: 100 // <- the primary key must have maxLength
                    },
                    name: {
                        type: 'string'
                    },
                    description: {
                        type: 'string'
                    },
                    start: {
                        type: 'string',
                        // format: 'date-time'
                    },
                    finish: {
                        type: 'string',
                        // format: 'date-time'
                    }
                },
                required: ['id', 'name']
            }
        }
    });

}

export { initCache, eaCache }