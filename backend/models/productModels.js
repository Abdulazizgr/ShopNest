import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shortDescription: { type: String, maxLength: 150, required: true },
  detailDescription: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: { type: Array, required: true },
  averageRating: { type: Number, default: 0 },
  bestSeller: { type: Boolean },
  date: { type: Number, required: true },
   reviews: {
    type: [
      {
        userId: { type: String, required: true },
        user: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },  
    ],
    default: [],
  },
});
const ProductModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default ProductModel;
