import "dotenv/config";
import express from "express";
import router from "../routes/index.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";

const createServer = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/", router);

  app.use(errorMiddleware);

  return app;
};

export default createServer;
