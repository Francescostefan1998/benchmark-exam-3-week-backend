import express from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import ReviewModel from "./model.js";
import q2m from "query-to-mongo";
import ProductModel from "../products/model.js";

const reviewRouter = express.Router();

reviewRouter.post("/", async (req, res, next) => {
  try {
    const newReview = new ReviewModel(req.body);
    const { _id } = await newReview.save();

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.body.product,
      { $push: { reviews: _id } },
      { new: true }
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

    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});
reviewRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const { total, reviews } = await ReviewModel.findReviewWithProduct(
      mongoQuery
    );
    res.send({
      links: mongoQuery.links("http://localhost:3001/reviews", total),
      total,
      totalPages: Math.ceil(total / mongoQuery.options.limit),
      reviews,
    });
  } catch (error) {
    next(error);
  }
});
reviewRouter.get("/:reviewId", async (req, res, next) => {
  try {
    const review = await ReviewModel.findById(req.params.reviewId).populate({
      path: "product",
      select: "name description brand imageUrl price category ",
    });
    if (review) {
      res.send(review);
    } else {
      next(createHttpError(`review with id ${req.params.reviewId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
reviewRouter.put("/:reviewId", async (req, res, next) => {
  try {
    const updateReview = await ReviewModel.findByIdAndUpdate(
      req.params.reviewId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updateReview) {
      res.send(updateReview);
    } else {
      next(createHttpError(`review with id ${req.params.reviewId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
reviewRouter.delete("/:reviewId", async (req, res, next) => {
  try {
    const deleteReview = await ReviewModel.findByIdAndDelete(
      req.params.reviewId
    );
    if (deleteReview) {
      res.status(202).send("deleted");
    } else {
      next(createHttpError(`review with id ${req.params.reviewId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

export default reviewRouter;
