import express from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import ReviewModel from "./model.js";

const reviewRouter = express.Router();

reviewRouter.post("/", async (req, res, next) => {
  try {
    const newReview = new ReviewModel(req.body);
    const { _id } = await newReview.save();

    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});
reviewRouter.get("/", async (req, res, next) => {
  try {
    const reviews = await ReviewModel.find();
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});
reviewRouter.get("/:reviewId", async (req, res, next) => {
  try {
    const review = await ReviewModel.findById(req.params.reviewId);
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
