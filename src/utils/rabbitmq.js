import amqp from "amqplib";

let connection;
let channel;

const QUEUE_NAME = "job_applications";

export const initRabbitMQ = async () => {
  try {
    const amqpUrl =
      process.env.AMQP_URL ||
      `amqp://${process.env.RABBITMQ_USER || "guest"}:${process.env.RABBITMQ_PASSWORD || "guest"}@${process.env.RABBITMQ_HOST || "localhost"}:${process.env.RABBITMQ_PORT || 5672}`;

    connection = await amqp.connect(amqpUrl);
    channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log("RabbitMQ connected successfully");
    return channel;
  } catch (error) {
    console.error("RabbitMQ connection error:", error);
    throw error;
  }
};

export const publishMessage = async (message) => {
  try {
    if (!channel) {
      await initRabbitMQ();
    }

    const messageContent = JSON.stringify(message);
    channel.sendToQueue(QUEUE_NAME, Buffer.from(messageContent), {
      persistent: true,
    });

    console.log("Message published:", messageContent);
  } catch (error) {
    console.error("Error publishing message:", error);
  }
};

export const consumeMessages = async (callback) => {
  try {
    if (!channel) {
      await initRabbitMQ();
    }

    await channel.consume(QUEUE_NAME, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          console.log("Message received:", content);
          await callback(content);
          channel.ack(msg);
        } catch (error) {
          console.error("Error processing message:", error);
          channel.nack(msg, false, false);
        }
      }
    });
  } catch (error) {
    console.error("Error consuming messages:", error);
  }
};

export const closeRabbitMQ = async () => {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    console.log("RabbitMQ connection closed");
  } catch (error) {
    console.error("Error closing RabbitMQ:", error);
  }
};

export default {
  initRabbitMQ,
  publishMessage,
  consumeMessages,
  closeRabbitMQ,
};
