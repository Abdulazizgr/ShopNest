class ApiConfig {
  static const String baseUrl = 'http://localhost:3000';

  static const String productList = '$baseUrl/api/product/list';
  static const String productDetails = '$baseUrl/api/product/details';
  static const String productReview = '$baseUrl/api/product/review';

  static const String userRegister = '$baseUrl/api/user/register';
  static const String userLogin = '$baseUrl/api/user/login';
  static const String userProfile = '$baseUrl/api/user/my-profile';
  static const String userEditProfile = '$baseUrl/api/user/editProfile';
  static const String userChangePassword = '$baseUrl/api/user/changePassword';
  static const String userSubscribe = '$baseUrl/api/user/subscribe';

  static const String cartGet = '$baseUrl/api/cart/get';
  static const String cartAdd = '$baseUrl/api/cart/add';
  static const String cartUpdate = '$baseUrl/api/cart/update';

  static const String orderPlace = '$baseUrl/api/order/place';
  static const String orderStripe = '$baseUrl/api/order/stripe';
  static const String orderChapa = '$baseUrl/api/order/chapa';
  static const String orderUserOrders = '$baseUrl/api/order/userorders';
  static const String orderTrack = '$baseUrl/api/order/trackOrder';
  static const String orderVerifyStripe = '$baseUrl/api/order/verifyStripe';
  static String orderVerifyChapa(String txRef, String orderId) =>
      '$baseUrl/api/order/verify-chapa/$txRef/$orderId';
}
