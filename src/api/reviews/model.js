import mongoose from "mongoose";

const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    comment: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  {
    timestamps: true,
  }
);

reviewSchema.static("findReviewWithProduct", async function (query) {
  const total = await this.countDocuments(query.criteria);
  const reviews = await this.find(query.criteria, query.criteria.fields)
    .limit(query.options.limit)
    .skip(query.options.skip)
    .sort(query.options.sort)
    .populate({
      path: "product",
      select: "name description brand imageUrl price category ",
    });
  return { total, reviews };
});

export default model("Review", reviewSchema);
