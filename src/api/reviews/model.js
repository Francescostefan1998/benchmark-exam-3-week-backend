import mongoose from "mongoose";

const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    comment: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
  },
  {
    timestamps: true,
  }
);

export default model("Review", reviewSchema);
