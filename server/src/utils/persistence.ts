import cron from 'node-cron';
import { log } from "./logger.js";
import config from './config.js';
import { eaCache, restoreEventStream$ } from '../middlewares/apiGateway.js';
import { Event } from '../models/Event.js';
import fs from 'node:fs';
import zlib from 'node-gzip';
import knex from '../knex.js';
import { cacheNameEnum} from '../Models/Model.js';

import { Model } from 'firebase-admin/machine-learning';
import { getDocumentById } from '../controllers/CacheController.js';
const scheduleBackup = () => {
    cron.schedule(config.backupSchedule, () => {
        log.info("scheduled backup starting in: " + config.backupTarget);
        doBackup(cacheNameEnum.EVENTS);
        doBackup(cacheNameEnum.GEOCODING);
    });
};

async function backupEventHandler (req, res) {
    let collectionName = req.params.collectionName;

    if (!(collectionName === cacheNameEnum.EVENTS 
        || collectionName === cacheNameEnum.GEOCODING)) {
        res.status(404);
        res.send("requested collection not found");
        return;
    }

    log.info(`executing backup for collection: ${collectionName}`);
    let backupSize = await doBackup(collectionName);
    if (backupSize > 0) {
        res.status(200);
        res.send(`backup finished (${backupSize} records).`);
        return
    }

    res.status(500);
    res.send("backup failed. see console logs for details");
    return
}

async function doBackup(cacheName: string): Promise<number> {

    let backupTarget = config.backupTarget.split(':');

    // local folder kind of backup/restore
    if (backupTarget.length === 2 && backupTarget[0] === "file") {
        try {
            let dir = config.backupTarget[1];
            let ts = new Date().getTime();
            let fileName = `backup.${cacheName}.${ts}.json.gz`;
            log.info(`saving ${cacheName} backup in: ${dir}/${fileName}`);

            let result = await eaCache[cacheName].find({
                selector: {
                    $and: [
                        { id: { $regex: ".*", $options: 'i' } },
                    ]
                }
            }).exec();

            if (result.length > 0) {
                fs.writeFileSync(`${dir}/${fileName}`, await zlib.gzip(JSON.stringify(result, null, 2)));
                log.info(`backup of cache ${cacheName} done (${result.length} records)`);
                return result.length;
            }
            log.warn(`current dataset in rxdb is empty. no backup has been taken.`);

        } catch (e) {
            log.error(`error while taking backup: ${e}`);
        }

    } else if (backupTarget.length === 2 && backupTarget[0] === "sql") {
        let result = await eaCache[cacheName].find({
                selector: {
                    $and: [
                        { id: { $regex: ".*", $options: 'i' } },
                    ]
                }
            }).exec();

            for (let r of result) {
                r.attachments = (await getDocumentById(r.externalId)).allAttachments();
            }

            for (let r of result) {
                console.log(r.attachments);
            }

            if (result.length > 0) {                
                let compressed = await zlib.gzip(JSON.stringify(result, null, 2));
                log.info(`backup of cache ${cacheName} done (${result.length} records)`);
                
                await knex(backupTarget[1])
                    .insert({ "content": compressed, "cache_name": cacheName })
                    .returning(['id']);
                return result.length;
            }
            log.warn(`current dataset in rxdb is empty. no backup has been taken.`);

    } else {
        log.error("backupSrc must be sql:{tablename} or file:{folderpath}");
    }

    return 0;
}

// instruct the RxDB replication handler to repull from the configured source
function restoreEventHandler (req, res) {
    let collectionName = req.params.collectionName;

    if (!(collectionName === cacheNameEnum.EVENTS 
        || collectionName === cacheNameEnum.GEOCODING)) {
        res.status(404);
        res.send("requested collection not found");
        return;
    }

    log.warn(`executing restore for collection: ${collectionName}`);
    if (collectionName === cacheNameEnum.EVENTS) {
        restoreEventStream$.next("RESYNC");

    } else if (collectionName === cacheNameEnum.GEOCODING) {
        // restoreGeocodingStream$.next("RESYNC");
    }

    res.status(200);
    res.send(`restore for ${collectionName} scheduled. see server logs for status`);
}

async function doEventsRestore(checkpointOrNull: any, batchSize) {
    try {
        let events: Event[] = await getLatestBackupContent(cacheNameEnum.EVENTS);

        if (events.length === 0) {
            log.error(`no backup or empty backup. restore process won't do anything`);
        }

        log.warn(`sending data to rxdb engine for restoration`);
        return {
            documents: events,
            checkpoint: { id: 1 },
            hasMoreDocuments: false
        };

    } catch (e) {
        log.error(`unable to list backup dir content: ${e}`);
    }

    return [];
}


async function doGeocodingRestore(checkpointOrNull: any, batchSize) {
    try {
        let entries: object[] = await getLatestBackupContent(cacheNameEnum.GEOCODING);

        if (entries.length === 0) {
            log.error(`no backup or empty backup. restore process won't do anything`);
        }

        log.warn(`sending data to rxdb engine for restoration`);
        return {
            documents: entries,
            checkpoint: { id: 1 },
            hasMoreDocuments: false
        };

    } catch (e) {
        log.error(`unable to list backup dir content: ${e}`);
    }

    return [];
}

async function getLatestBackupContent(cacheName: string): Promise<Array<Event>> {
    if (!(cacheName === cacheNameEnum.EVENTS 
        || cacheName === cacheNameEnum.GEOCODING)) {
            log.error(`unsupported cache name: ${cacheName}`);
            return [];
    }
    let backupTarget = config.backupTarget.split(':');

    // local folder kind of backup/restore
    if (backupTarget.length === 2 && backupTarget[0] === "file") {
        let dir = backupTarget[1];
        
        log.warn(`current dir is: ${process.cwd()}`);
        log.warn(`backup folder is: ${dir}/`);

        // account for all filesystem-related erros (ENOENT, ..)
        try {
            let files = fs.readdirSync(`${dir}/`);
            let backups: string[] = [];

            files.forEach( (file) => {
                if (file.startsWith("backup.") && file.endsWith(".json.gz")) {
                    backups.push(file);
                }
            });

            if (backups.length === 0) {
                log.error(`no backup file found`);
                return [];
            }
    
            let newestFile = backups.map(name => ({ name, ctime: fs.statSync(`${dir}/${name}`).ctimeMs }))
                .sort((a, b) => b.ctime - a.ctime)[0].name;
            log.warn(`latest backup file found is: ${newestFile}`);

            let compressed = fs.readFileSync(`${dir}/${newestFile}`);
            const decompressed = await zlib.ungzip(compressed);
            let data = JSON.parse(decompressed.toString());

            log.warn(`found ${data.length} records in ${cacheName} backup`);
            return data;

        } catch (e) {
            log.error(e);
        }

    } else if (backupTarget.length === 2 && backupTarget[0] === "sql") {
        let compressed = await knex(backupTarget[1])
            .select('content')
            .where('cache_name','=',cacheName)
            .orderBy('created_at','desc')
            .first();

        if (!compressed) {
            log.error(`unable to restore ${cacheName}. no record found in database`)
            return [];
        }

        const decompressed = await zlib.ungzip(compressed.content);
        let data = JSON.parse(decompressed.toString());

        log.warn(`found ${data.length} records in ${cacheName} backup`);
        return data;


    } else {
        log.error("backupSrc must be sql:{tablename} or file:{folderpath}");
    }
        
    return [];
}

export { scheduleBackup, backupEventHandler, restoreEventHandler, doEventsRestore, doGeocodingRestore};
