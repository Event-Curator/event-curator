import cron from 'node-cron';
import { log } from "../utils/logger.js";
import config from './config.js';
import { eaCache, restoreEventStream$ } from '../middlewares/apiGateway.js';
import { Event } from '../models/Event.js';
import fs from 'fs';

/*
 * 
 */
const scheduleBackup = () => {
    cron.schedule(config.backupSchedule, () => {
        log.info("scheduled backup starting in: " + config.backupTarget);
        doBackup();
    });
};

async function backupEventHandler (req, res) {
    let collectionName = req.params.collectionName;

    if (!(collectionName === "events")) {
        res.status(404);
        res.send("requested collection not found");
        return;
    }

    log.info(`executing backup for collection: ${collectionName}`);
    let backupSize = await doBackup();
    if (backupSize > 0) {
        res.status(200);
        res.send(`backup finished (${backupSize} records).`);
        return
    }

    res.status(500);
    res.send("backup failed. see console logs for details");
    return
}

async function doBackup(): Promise<number> {
    try {
        let dir = config.backupTarget;
        let ts = new Date().getTime();
        let fileName = `backup.events.${ts}.json`;
        log.info(`saving events backup in: ${dir}${fileName}`);

        let result = await eaCache.events.find({
            selector: {
                $and: [
                    { name: { $regex: ".*", $options: 'i' } },
                ]
            }
        }).exec();

        if (result.length === 0) {
            log.warn(`current dataset in rxdb is empty. terminating backup process`);
        }

        fs.writeFileSync(`${dir}${fileName}`, JSON.stringify(result));
        log.info(`backup done (${result.length} records)`);

        return result.length;

    } catch (e) {
        log.error(`error while taking backup: ${e}`);
    }

    return 0;
}

// instruct the RxDB replication handler to repull from the configured source
function restoreEventHandler (req, res) {
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

async function doRestore(checkpointOrNull: any, batchSize) {
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

export { scheduleBackup, backupEventHandler, restoreEventHandler, doRestore};
