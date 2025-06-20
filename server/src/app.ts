import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { log } from "./utils/logger.js";
import config from "./utils/config.js";
import eventRoute from "./routes/eventRoutes.js";
import userRoute from "./routes/userRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { syncFirebaseUsers } from "./middlewares/authSync.js";
import { initCache, eaCache } from "./middlewares/apiGateway.js";
import { scheduleBackup } from "./utils/persistence.js";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

let absolutePathReact = "/opt/render/project/src";
let absolutePathStatic = "./client/dist";
if (process.env.NODE_ENV === "development") {
  absolutePathReact = process.cwd();
  absolutePathStatic = "../client/dist";
}

log.info("using those paths for express");
log.info("absolutePathReact: " + absolutePathReact);
log.info("absolutePathStatic: " + absolutePathStatic);

// to fix the static url problem (sharing link)
let myHandler = function (req, res) {
  res.sendFile(
    path.join(absolutePathReact, "./client/dist/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
};

app.use(express.static(absolutePathStatic));
app.get("/", myHandler);
app.get("/event", myHandler);
app.get("/event/:a", myHandler);
app.get("/timeline/public/:a", myHandler);
app.get("/timeline", myHandler);

app.use("/media", express.static(`${config.mediaStoragePath}`));
app.use("/api", eventRoute);
app.use("/api", userRoute);
app.use(errorHandler);

scheduleBackup();
syncFirebaseUsers();

async function testCache() {
  const myDocument = await eaCache.events.insert({
    id: "event1",
    name: "Fiesta !",
    // done: false,
    // timestamp: new Date().toISOString()
  });
  console.log("cache entry inserted)");

  const foundDocuments = await eaCache.events
    .find({
      selector: {
        id: {
          $eq: "event1",
        },
      },
    })
    .exec();

  console.log("RESULT:");
  console.log(foundDocuments);
}

(async () => {
  await initCache();
  // testCache();
})();

app.listen(config.port, () => {
  log.info(`Server listening on port ${config.port}.`);
});
