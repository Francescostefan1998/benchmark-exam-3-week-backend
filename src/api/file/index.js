import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import ReviewModel from "../reviews/model.js";
import ProductModel from "../products/model.js";

const filesRouter = express.Router();

const cloudUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "products",
    },
  }),
}).single("imageUrl");
filesRouter.post("/:productId", cloudUploader, async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.productId);
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.productId,
      { imageUrl: req.file.path },

      { new: true, runValidators: true }
    );
    if (updatedProduct) {
      res.send(updatedProduct);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default filesRouter;
