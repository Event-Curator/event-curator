import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { log } from './utils/logger'
import config from './utils/config';
import eventRoute from './routes/eventRoutes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
app.use(express.json())
app.use(cors());
app.use(express.static("../client/dist"));
app.use('/api', eventRoute);
app.use(errorHandler);

app.listen(config.port, () => {
  log.info(`Server listening on port ${config.port}.`);
});
