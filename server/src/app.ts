import express from 'express';
import eventRoute from './routes/eventRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { log } from './utils/logger'

const app = express();

app.use(express.json());

app.use('/api', eventRoute);

app.use(errorHandler);

export default app;
