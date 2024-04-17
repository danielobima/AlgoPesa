import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/router";
import path from "path";
import axios from "axios";
import dayjs from "dayjs";
import { getRate } from "./call";

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
// a comment
// app.use(cookieParser());

const port = parseInt(process.env.PORT || "3000", 10);

app.use("/api", router);

(async () => {
  //   await transporter.verify();
  //   console.log(">>>>>> Mail transporter ready");
  //   await sequelize.authenticate();
  //   console.log(">>>>>> DB connected successfully");
  app.listen(port, () => {
    console.log(`Running on port ${port}.`);
  });
})();
