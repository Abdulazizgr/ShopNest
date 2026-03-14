import 'package:flutter/material.dart';
import '../config/api_config.dart';
import '../models/product.dart';
import '../services/api_service.dart';

class CartProvider extends ChangeNotifier {
  // { productId: { size: quantity } }
  Map<String, Map<String, int>> _cartItems = {};
  final bool _isLoading = false;

  Map<String, Map<String, int>> get cartItems => _cartItems;
  bool get isLoading => _isLoading;

  int get itemCount {
    int count = 0;
    _cartItems.forEach((_, sizes) {
      sizes.forEach((_, qty) {
        count += qty;
      });
    });
    return count;
  }

  double getCartTotal(List<Product> products) {
    double total = 0;
    _cartItems.forEach((productId, sizes) {
      final product = products.where((p) => p.id == productId).firstOrNull;
      if (product != null) {
        sizes.forEach((_, qty) {
          total += product.price * qty;
        });
      }
    });
    return total;
  }

  Future<void> loadCart(String token) async {
    try {
      final res = await ApiService.post(ApiConfig.cartGet, token: token);
      if (res['success'] == true && res['cartData'] != null) {
        final data = res['cartData'] as Map<String, dynamic>;
        _cartItems = {};
        data.forEach((productId, sizes) {
          if (sizes is Map) {
            _cartItems[productId] = {};
            sizes.forEach((size, qty) {
              if (qty is int && qty > 0) {
                _cartItems[productId]![size] = qty;
              } else if (qty is num && qty.toInt() > 0) {
                _cartItems[productId]![size] = qty.toInt();
              }
            });
            if (_cartItems[productId]!.isEmpty) {
              _cartItems.remove(productId);
            }
          }
        });
        notifyListeners();
      }
    } catch (_) {}
  }

  Future<void> addToCart(String productId, String size, String? token) async {
    if (!_cartItems.containsKey(productId)) {
      _cartItems[productId] = {};
    }
    _cartItems[productId]![size] = (_cartItems[productId]![size] ?? 0) + 1;
    notifyListeners();

    if (token != null) {
      try {
        await ApiService.post(
          ApiConfig.cartAdd,
          body: {'productId': productId, 'size': size},
          token: token,
        );
      } catch (_) {}
    }
  }

  Future<void> updateQuantity(
    String productId,
    String size,
    int quantity,
    String? token,
  ) async {
    if (quantity <= 0) {
      _cartItems[productId]?.remove(size);
      if (_cartItems[productId]?.isEmpty ?? false) {
        _cartItems.remove(productId);
      }
    } else {
      _cartItems[productId] ??= {};
      _cartItems[productId]![size] = quantity;
    }
    notifyListeners();

    if (token != null) {
      try {
        await ApiService.post(
          ApiConfig.cartUpdate,
          body: {
            'productId': productId,
            'size': size,
            'quantity': quantity,
          },
          token: token,
        );
      } catch (_) {}
    }
  }

  void clearCart() {
    _cartItems = {};
    notifyListeners();
  }

  List<Map<String, dynamic>> getCartProducts(List<Product> products) {
    final List<Map<String, dynamic>> items = [];
    _cartItems.forEach((productId, sizes) {
      final product = products.where((p) => p.id == productId).firstOrNull;
      if (product != null) {
        sizes.forEach((size, qty) {
          items.add({
            'product': product,
            'size': size,
            'quantity': qty,
          });
        });
      }
    });
    return items;
  }
}
