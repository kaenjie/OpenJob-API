import "dotenv/config";
import express from "express";
import router from "../routes/index.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";
import { initRabbitMQ } from "../utils/rabbitmq.js";

const createServer = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/", router);

  app.use(errorMiddleware);

  return app;
};

// Initialize RabbitMQ connection
try {
  await initRabbitMQ();
} catch (error) {
  console.error("Failed to initialize RabbitMQ:", error);
  // Continue even if RabbitMQ fails to connect
}

export default createServer;
