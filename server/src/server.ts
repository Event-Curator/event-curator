import app from './app';
import config from './config/config';
import { log } from './utils/logger';

app.listen(config.port, () => {
    log.info(`listeging to port ${config.port}`)
})
