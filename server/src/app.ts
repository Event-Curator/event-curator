import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import admin from "firebase-admin";
import serviceAccountRaw from "./serviceAccountKey.json";
import type { ServiceAccount } from "firebase-admin";
dotenv.config();
const serviceAccount = serviceAccountRaw as ServiceAccount;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//create express server
const app = express();
const PORT = process.env.PORT || 3000;
//cors and a static file destination
app.use(cors());
app.use(express.static("../client/dist"));
//routers
//start listening on port 3000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
