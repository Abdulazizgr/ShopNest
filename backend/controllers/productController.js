import { v2 as cloudinary } from "cloudinary";
import ProductModel from "../models/productModels.js";
import UserModel from "../models/userModel.js";

// add product controller
const addProduct = async (req, res) => {
  try {
    const {
      name,
      shortDescription,
      detailDescription,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
    } = req.body;
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imageUrls = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      shortDescription,
      detailDescription,
      category,
      price: parseFloat(price),
      subCategory,
      bestSeller: bestSeller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: imageUrls,
      date: Date.now(),
    };
    const product = new ProductModel(productData);
    await product.save();

    res.json({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// list all products
const listProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({});

    res.json({
      success: true,
      message: "Products fetched successfully",
      products: products,
    });
  } catch (error) {
    console.error("Error listing products:", error);
    res.json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// update product
const updateProduct = async (req, res) => {
  try {
    const {
      productId,
      name,
      shortDescription,
      detailDescription,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
    } = req.body;

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }

    // Handle new images (optional)
    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4];

    let newImageUrls = [...product.image]; // keep old images by default

    for (let i = 0; i < images.length; i++) {
      if (images[i]) {
        const result = await cloudinary.uploader.upload(images[i].path, {
          resource_type: "image",
        });
        newImageUrls[i] = result.secure_url; // replace specific image
      }
    }

    // Update fields
    product.name = name || product.name;
    product.shortDescription = shortDescription || product.shortDescription;
    product.detailDescription = detailDescription || product.detailDescription;
    product.price = price ? parseFloat(price) : product.price;
    product.category = category || product.category;
    product.subCategory = subCategory || product.subCategory;
    product.sizes = sizes ? JSON.parse(sizes) : product.sizes;
    product.bestSeller =
      bestSeller !== undefined
        ? bestSeller === "true" || bestSeller === true
        : product.bestSeller;
    product.image = newImageUrls;

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// remove product
const removeProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.json({
        success: false,
        message: "Product ID is required",
      });
    }
    const product = await ProductModel.findByIdAndDelete(productId);
    if (!product) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }
    res.json({
      success: true,
      message: "Product removed successfully",
    });
  } catch (error) {
    console.error("Error removing product:", error);
    res.json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// single product details
const productDetails = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.json({
        success: false,
        message: "Product ID is required",
      });
    }
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }
    res.json({
      success: true,
      message: "Product details fetched successfully",
      product: product,
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// Add reviews to product
const addReview = async (req, res) => {
  try {
    const { productId, userId, rating, comment } = req.body;
    if (!productId || !userId || !rating || !comment) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }
    const alreadyReviewed = product.reviews.find(
      (review) => review.userId !== userId
    );
    if (alreadyReviewed) {
      return res.json({
        success: false,
        message: "You have already reviewed this product",
      });
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
    const newReview = {
      userId: user._id,
      user: user.firstName + " " + user.lastName,
      rating: parseInt(rating),
      comment,
    };
    product.reviews.push(newReview);
    product.averageRating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;
    await product.save();
    res.json({
      success: true,
      message: "Review added successfully",
      reviews: product.reviews,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export {
  addProduct,
  listProducts,
  removeProduct,
  productDetails,
  addReview,
  updateProduct,
};
