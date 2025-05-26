import express from 'express';
import eventRoute from './routes/eventRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

app.use('/api', eventRoute);

app.use(errorHandler);

export default app;
