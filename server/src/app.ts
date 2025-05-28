import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { log } from "./utils/logger.js";
import config from "./utils/config.js";
import eventRoute from "./routes/eventRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const result = dotenv.config();
if (result.error) {
  throw result.error
}
console.log("------------------");
console.log(result);
console.log("------------------");


const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("../client/dist"));
app.use("/api", eventRoute);
app.use(errorHandler);

app.listen(config.port, () => {
  log.info(`Server listening on port ${config.port}.`);
  console.log(config);
  console.log(Object.keys(config));
  console.log(`Firebase config is: ` + config.firebase.private_key);
  console.log("test" + process.env);
});
