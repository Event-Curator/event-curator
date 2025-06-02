import express from "express";
import { Request, Response } from "express";
const dummyDataController = express.Router();
import makeRandomEventsArr from "../models/dummyData.model.js";

dummyDataController.get("/", (_req: Request, res: Response): void => {
  res.json(makeRandomEventsArr(10));
});

export default dummyDataController;
