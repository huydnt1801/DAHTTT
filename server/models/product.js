import mongoose from "mongoose";
const { Schema, model } = mongoose;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export default model("Product", productSchema);
