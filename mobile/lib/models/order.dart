class OrderItem {
  final String orderId;
  final String productId;
  final String name;
  final String image;
  final double price;
  final int quantity;
  final String size;
  final String status;
  final bool payment;
  final String paymentMethod;
  final DateTime date;

  OrderItem({
    required this.orderId,
    required this.productId,
    required this.name,
    required this.image,
    required this.price,
    required this.quantity,
    required this.size,
    required this.status,
    required this.payment,
    required this.paymentMethod,
    required this.date,
  });

  OrderItem copyWith({String? status}) {
    return OrderItem(
      orderId: orderId,
      productId: productId,
      name: name,
      image: image,
      price: price,
      quantity: quantity,
      size: size,
      status: status ?? this.status,
      payment: payment,
      paymentMethod: paymentMethod,
      date: date,
    );
  }

  factory OrderItem.fromOrderJson(
    Map<String, dynamic> orderJson,
    Map<String, dynamic> productJson,
  ) {
    return OrderItem(
      orderId: orderJson['_id'] ?? '',
      productId: productJson['_id'] ?? '',
      name: productJson['name'] ?? '',
      image: productJson['image'] is List && productJson['image'].isNotEmpty
          ? productJson['image'][0]
          : (productJson['image'] ?? ''),
      price: (productJson['price'] ?? 0).toDouble(),
      quantity: (productJson['quantity'] ?? 1).toInt(),
      size: productJson['size'] ?? '',
      status: orderJson['status'] ?? 'Order Placed',
      payment: orderJson['payment'] ?? false,
      paymentMethod: orderJson['paymentMethod'] ?? 'COD',
      date: orderJson['date'] != null
          ? DateTime.tryParse(orderJson['date'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}

class Address {
  String firstName;
  String lastName;
  String email;
  String street;
  String city;
  String state;
  String zipCode;
  String country;
  String phone;

  Address({
    this.firstName = '',
    this.lastName = '',
    this.email = '',
    this.street = '',
    this.city = '',
    this.state = '',
    this.zipCode = '',
    this.country = '',
    this.phone = '',
  });

  Map<String, dynamic> toJson() {
    return {
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'street': street,
      'city': city,
      'state': state,
      'zipCode': zipCode,
      'country': country,
      'phone': phone,
    };
  }

  bool get isValid =>
      firstName.isNotEmpty &&
      lastName.isNotEmpty &&
      email.isNotEmpty &&
      street.isNotEmpty &&
      city.isNotEmpty &&
      state.isNotEmpty &&
      zipCode.isNotEmpty &&
      country.isNotEmpty &&
      phone.isNotEmpty;
}
