import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("../../client/dist"));
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
