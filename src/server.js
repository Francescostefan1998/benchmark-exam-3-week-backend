import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import {
  badRequestHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js";
import productRouter from "./api/products/index.js";
import reviewRouter from "./api/reviews/index.js";
import filesRouter from "./api/file/index.js";
const server = express();
const port = process.env.PORT || 3001;

server.use(cors());
server.use(express.json());
server.use("/products", productRouter);
server.use("/products", filesRouter);
server.use("/reviews", reviewRouter);
server.use(badRequestHandler);
server.use(notFoundHandler);

server.use(genericErrorHandler);
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on("connected", () => {
  console.log("Connected to Mongo DB");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
});
