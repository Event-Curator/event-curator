import cron from 'node-cron';
import { log } from "../utils/logger.js";
import config from './config.js';
import { restoreEventStream$ } from '../middlewares/apiGateway.js';
import { Event } from '../models/Event.js';
import fs from 'fs';

/*
 * 
 */
const scheduleBackup = () => {
    cron.schedule(config.backupSchedule, () => {
        log.info("hi ! will take a backup to: " + config.backupTarget);
    });
};


// instruct the RxDB replication handler to repull from the configured source
function doRestore (req, res) {
    let collectionName = req.params.collectionName;

    if (!(collectionName === "events")) {
        res.status(404);
        res.send("requested collection not found");
        return;
    }

    log.warn(`executing restore for collection: ${collectionName}`);
    restoreEventStream$.next("RESYNC");

    res.status(200);
    res.send(`restore for ${collectionName} scheduled. see server logs for status`);
}

function doBackup (req, res) {
    let collectionName = req.params.collectionName;

    if (!(collectionName === "events")) {
        res.status(404);
        res.send("requested collection not found");
        return;
    }

    log.debug(`executing restore for collection: ${collectionName}`);
    // backupEventStream$.next("RESYNC");
}

async function restoreEventHandler(checkpointOrNull: any, batchSize) {
    // const data = fakePull("ed399f4d394dddc4e6be424dc43d0617");
    log.warn("handling an event restore request. checkpoint is: " + checkpointOrNull);
    try {
        let events: Event[] = await getLatestBackupContent("events");

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

// function fakePull(id: string) {
//     const documents = testEvent;
//     const newCheckpoint = documents.length === 0 ? { id } : {
//         id: documents[1].id,
//     };
//     return { documents: documents, checkpoint: newCheckpoint };
// }

async function getLatestBackupContent(backupType: string): Promise<Array<Event>> {
    if (backupType !== "events") return [];    
    let dir = config.backupTarget;
    
    log.warn(`current dir is: ${process.cwd()}`);
    log.warn(`backup folder is: ${dir}`);

    // account for all filesystem-related erros (ENOENT, ..)
    try {
        let files = fs.readdirSync(`${dir}/`);
        let backups: string[] = [];

        files.forEach( (file) => {
            backups.push(file);
        });

        if (backups.length === 0) {
            log.error(`no backup file found`);
            return [];
        }

        let newestFile = backups.map(name => ({ name, ctime: fs.statSync(`${dir}/${name}`).ctimeMs }))
            .sort((a, b) => b.ctime - a.ctime)[0].name;
        log.warn(`latest backup file found is: ${newestFile}`);

        let data = JSON.parse(
            fs.readFileSync(`${dir}/${newestFile}`).toString()
        );

        log.warn(`found  ${data.length} records in backup`);
        return data;

    } catch (e) {
        log.error(e);
    }

    return [];
}

export { scheduleBackup, doBackup, doRestore, restoreEventHandler };
