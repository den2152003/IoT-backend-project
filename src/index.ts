import express, { type Request, type Response } from "express";

import cookieParser from "cookie-parser";
import ENV from "@/cores/ENV";
import accessControlAllow from "@/middlewares/accessControlAllow";
import { subscribeMqttTopics } from "@/mqtt/subscriber";

import dbConnect from "@/utils/dbConnect";
import routes from "@/routes";
import errorHandler from "./middlewares/errorHandler";

const app = express();

// Log HTTP requests
app.use((req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    console.log(
      `[${new Date().toLocaleTimeString("vi-VN")}]`,
      req.method,
      req.originalUrl,
      res.statusCode,
      `${Date.now() - startTime}ms`,
    );
  });

  next();
});

app.use(accessControlAllow as never);

app.use(express.json());
app.use(cookieParser());

const startServer = async (): Promise<void> => {
  await dbConnect();

  subscribeMqttTopics();

  app.use(routes);

  app.use(errorHandler as never);

  app.listen(ENV.PORT, () => {
    console.log(`Server running at http://localhost:${ENV.PORT}`);
  });
};

void startServer();
