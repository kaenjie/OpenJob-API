import "dotenv/config";
import { consumeMessages, initRabbitMQ } from "./utils/rabbitmq.js";
import ApplicationsService from "./services/ApplicationsService.js";
import UsersService from "./services/UsersService.js";
import JobsService from "./services/JobsService.js";
import nodemailer from "nodemailer";

const emailTransporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: process.env.MAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const processApplicationMessage = async (message) => {
  try {
    const { application_id } = message;

    console.log(`Processing application: ${application_id}`);

    const application = await ApplicationsService.getApplicationById(
      application_id,
    ).catch((err) => {
      console.error(`Application not found: ${application_id}`, err.message);
      return null;
    });

    if (!application) {
      console.log(`Skipping - application ${application_id} not found`);
      return;
    }

    const applicant = await UsersService.getUserById(application.user_id).catch(
      (err) => {
        console.error(
          `Applicant user not found: ${application.user_id}`,
          err.message
        );
        return null;
      }
    );

    if (!applicant) {
      console.log(`Skipping - applicant ${application.user_id} not found`);
      return;
    }

    const job = await JobsService.getJobById(application.job_id).catch((err) => {
      console.error(
        `Job not found: ${application.job_id}`,
        err.message
      );
      return null;
    });

    if (!job) {
      console.log(`Skipping - job ${application.job_id} not found`);
      return;
    }

    const jobOwner = await UsersService.getUserById(job.user_id).catch((err) => {
      console.error(`Job owner not found: ${job.user_id}`, err.message);
      return null;
    });

    if (!jobOwner || !jobOwner.email) {
      console.log(`Skipping - job owner ${job.user_id} not found or no email`);
      return;
    }

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: jobOwner.email,
      subject: `Kandidat Baru Melamar untuk ${job.title}`,
      html: `
        <h2>Notifikasi Lamaran Baru</h2>
        <p>Ada kandidat baru yang melamar untuk posisi Anda.</p>
        <h3>Detail Lamaran:</h3>
        <ul>
          <li><strong>Email Pelamar:</strong> ${applicant.email}</li>
          <li><strong>Nama Pelamar:</strong> ${applicant.name}</li>
          <li><strong>Posisi:</strong> ${job.title}</li>
          <li><strong>Tanggal Lamaran:</strong> ${new Date(application.created_at).toLocaleString("id-ID")}</li>
        </ul>
        <p>Silakan cek aplikasi Anda untuk melihat detail lamaran lengkap.</p>
      `,
    };

    await emailTransporter.sendMail(mailOptions);
    console.log(
      `✅ Email successfully sent to ${jobOwner.email} for application ${application_id}`
    );
  } catch (error) {
    console.error("Error processing application message:", error.message);
  }
};

const startConsumer = async () => {
  try {
    console.log("Starting RabbitMQ consumer...");
    await initRabbitMQ();

    console.log("✅ Listening for messages...");
    await consumeMessages(processApplicationMessage);
  } catch (error) {
    console.error("Consumer error:", error);
    console.log("Retrying in 5 seconds...");
    setTimeout(startConsumer, 5000);
  }
};

startConsumer();

process.on("SIGINT", () => {
  console.log("\nConsumer shutting down...");
  process.exit(0);
});
