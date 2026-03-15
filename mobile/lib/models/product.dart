class Review {
  final String user;
  final String comment;
  final int rating;
  final DateTime date;

  Review({
    required this.user,
    required this.comment,
    required this.rating,
    required this.date,
  });

  factory Review.fromJson(Map<String, dynamic> json) {
    return Review(
      user: json['user'] ?? 'Anonymous',
      comment: json['comment'] ?? '',
      rating: (json['rating'] ?? 0).toInt(),
      date: json['date'] != null
          ? DateTime.tryParse(json['date'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}

class Product {
  final String id;
  final String name;
  final double price;
  final List<String> images;
  final List<String> sizes;
  final String shortDescription;
  final String detailDescription;
  final String category;
  final String subCategory;
  final bool bestSeller;
  final double averageRating;
  final List<Review> reviews;

  Product({
    required this.id,
    required this.name,
    required this.price,
    required this.images,
    required this.sizes,
    required this.shortDescription,
    required this.detailDescription,
    required this.category,
    required this.subCategory,
    required this.bestSeller,
    required this.averageRating,
    required this.reviews,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    List<String> imageList = [];
    if (json['image'] is List) {
      imageList = (json['image'] as List).map((e) => e.toString()).toList();
    }

    List<String> sizeList = [];
    if (json['sizes'] is List) {
      sizeList = (json['sizes'] as List).map((e) => e.toString()).toList();
    }

    List<Review> reviewList = [];
    if (json['reviews'] is List) {
      reviewList =
          (json['reviews'] as List).map((e) => Review.fromJson(e)).toList();
    }

    return Product(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      images: imageList,
      sizes: sizeList,
      shortDescription: json['shortDescription'] ?? '',
      detailDescription: json['detailDescription'] ?? '',
      category: json['category'] ?? '',
      subCategory: json['subCategory'] ?? '',
      bestSeller: json['bestSeller'] ?? false,
      averageRating: (json['averageRating'] ?? 0).toDouble(),
      reviews: reviewList,
    );
  }
}
