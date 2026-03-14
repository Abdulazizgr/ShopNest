import 'package:flutter/material.dart';
import '../config/api_config.dart';
import '../models/order.dart';
import '../services/api_service.dart';

class OrderProvider extends ChangeNotifier {
  List<OrderItem> _orders = [];
  bool _isLoading = false;

  List<OrderItem> get orders => _orders;
  bool get isLoading => _isLoading;

  Future<void> fetchOrders(String token) async {
    _isLoading = true;
    notifyListeners();

    try {
      final res = await ApiService.post(
        ApiConfig.orderUserOrders,
        token: token,
      );

      if (res['success'] == true && res['orders'] != null) {
        _orders = [];
        for (final order in (res['orders'] as List).reversed) {
          final products = order['products'] as List? ?? [];
          for (final product in products) {
            _orders.add(OrderItem.fromOrderJson(order, product));
          }
        }
      }
    } catch (_) {}

    _isLoading = false;
    notifyListeners();
  }

  Future<Map<String, dynamic>> placeOrder({
    required Map<String, dynamic> address,
    required List<Map<String, dynamic>> products,
    required double amount,
    required String paymentMethod,
    required String token,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      String endpoint;
      switch (paymentMethod) {
        case 'stripe':
          endpoint = ApiConfig.orderStripe;
          break;
        case 'chapa':
          endpoint = ApiConfig.orderChapa;
          break;
        default:
          endpoint = ApiConfig.orderPlace;
      }

      final res = await ApiService.post(
        endpoint,
        body: {
          'address': address,
          'products': products,
          'amount': amount,
          'paymentMethod': paymentMethod,
        },
        token: token,
      );

      _isLoading = false;
      notifyListeners();
      return res;
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      return {'success': false, 'message': 'Connection error'};
    }
  }

  Future<String?> trackOrder({
    required String orderId,
    required String productId,
    required String size,
    required String token,
  }) async {
    try {
      final res = await ApiService.post(
        ApiConfig.orderTrack,
        body: {
          'orderId': orderId,
          'productId': productId,
          'size': size,
        },
        token: token,
      );

      if (res['success'] == true) {
        final status = res['status'] ?? 'Order Placed';
        final idx = _orders.indexWhere(
          (o) => o.orderId == orderId && o.productId == productId && o.size == size,
        );
        if (idx != -1) {
          _orders[idx] = _orders[idx].copyWith(status: status);
          notifyListeners();
        }
        return status;
      }
      return null;
    } catch (_) {
      return null;
    }
  }
}
