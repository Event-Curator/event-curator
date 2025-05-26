import app from './app';
import config from './config/config';

app.listen(config.port, () => {
    console.log(`Oh yeah... listeging to port ${config.port}`)
})
