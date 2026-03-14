import 'package:flutter/material.dart';
import '../config/api_config.dart';
import '../models/product.dart';
import '../services/api_service.dart';

class ProductProvider extends ChangeNotifier {
  List<Product> _products = [];
  bool _isLoading = false;
  String _searchQuery = '';
  bool _showSearch = false;

  List<Product> get products => _products;
  bool get isLoading => _isLoading;
  String get searchQuery => _searchQuery;
  bool get showSearch => _showSearch;

  List<Product> get latestProducts => _products.take(10).toList();

  List<Product> get bestSellers =>
      _products.where((p) => p.bestSeller).take(5).toList();

  Future<void> fetchProducts() async {
    _isLoading = true;
    notifyListeners();

    try {
      final res = await ApiService.get(ApiConfig.productList);
      if (res['success'] == true && res['products'] != null) {
        _products = (res['products'] as List)
            .map((e) => Product.fromJson(e))
            .toList();
      }
    } catch (_) {}

    _isLoading = false;
    notifyListeners();
  }

  Product? getProductById(String id) {
    try {
      return _products.firstWhere((p) => p.id == id);
    } catch (_) {
      return null;
    }
  }

  List<Product> getRelatedProducts(Product product) {
    return _products
        .where((p) =>
            p.id != product.id &&
            p.category == product.category &&
            p.subCategory == product.subCategory)
        .take(5)
        .toList();
  }

  List<Product> getFilteredProducts({
    List<String> categories = const [],
    List<String> subCategories = const [],
    String sortType = 'relevant',
  }) {
    var filtered = List<Product>.from(_products);

    if (_showSearch && _searchQuery.isNotEmpty) {
      filtered = filtered
          .where(
              (p) => p.name.toLowerCase().contains(_searchQuery.toLowerCase()))
          .toList();
    }

    if (categories.isNotEmpty) {
      filtered =
          filtered.where((p) => categories.contains(p.category)).toList();
    }

    if (subCategories.isNotEmpty) {
      filtered = filtered
          .where((p) => subCategories.contains(p.subCategory))
          .toList();
    }

    switch (sortType) {
      case 'low-high':
        filtered.sort((a, b) => a.price.compareTo(b.price));
        break;
      case 'high-low':
        filtered.sort((a, b) => b.price.compareTo(a.price));
        break;
    }

    return filtered;
  }

  Future<String?> addReview({
    required String productId,
    required String comment,
    required int rating,
    required String token,
  }) async {
    try {
      final res = await ApiService.post(
        ApiConfig.productReview,
        body: {
          'productId': productId,
          'comment': comment,
          'rating': rating,
        },
        token: token,
      );

      if (res['success'] == true) {
        await fetchProducts();
        return null;
      }
      return res['message'] ?? 'Failed to add review';
    } catch (e) {
      return 'Connection error. Please try again.';
    }
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void toggleSearch() {
    _showSearch = !_showSearch;
    if (!_showSearch) _searchQuery = '';
    notifyListeners();
  }

  void closeSearch() {
    _showSearch = false;
    _searchQuery = '';
    notifyListeners();
  }
}
