import cron from 'node-cron';
import { log } from "../utils/logger.js";

import config from './config.js';

/*
 * 
 */
const scheduleBackup = () => {
    cron.schedule(config.backupSchedule, () => {
        log.info("hi ! will take a backup to: " + config.backupUrl);
    });
};

export { scheduleBackup };
