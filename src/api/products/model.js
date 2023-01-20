import mongoose from "mongoose";

const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: true }, //REQUIRED
    description: { type: String, required: true }, //REQUIRED
    brand: { type: String, required: true }, //REQUIRED
    imageUrl: { type: String, required: true }, //REQUIRED}
    price: { type: Number, required: true }, //REQUIRED
    category: { type: String, required: true }, //REQUIRED},
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  {
    timestamps: true,
  }
);

productSchema.static("findProductsWithReviews", async function (query) {
  const total = await this.countDocuments(query.criteria);
  const products = await this.find(query.criteria, query.criteria.fields)
    .limit(query.options.limit)
    .skip(query.options.skip)
    .sort(query.options.sort)
    .populate({ path: "reviews", select: "comment firstName" });
  return { total, products };
});

export default model("Product", productSchema);
