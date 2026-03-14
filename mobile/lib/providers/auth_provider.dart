import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';
import '../models/user.dart';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  String? _token;
  User? _user;
  bool _isLoading = false;

  String? get token => _token;
  User? get user => _user;
  bool get isLoggedIn => _token != null;
  bool get isLoading => _isLoading;

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('token');
    if (_token != null) {
      await fetchProfile();
    }
    notifyListeners();
  }

  Future<String?> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final res = await ApiService.post(
        ApiConfig.userLogin,
        body: {'email': email, 'password': password},
      );

      if (res['success'] == true) {
        _token = res['token'];
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', _token!);
        await fetchProfile();
        return null;
      }
      return res['message'] ?? 'Login failed';
    } catch (e) {
      return 'Connection error. Please try again.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<String?> register({
    required String firstName,
    required String lastName,
    required String email,
    required String phone,
    required String password,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      final res = await ApiService.post(
        ApiConfig.userRegister,
        body: {
          'firstName': firstName,
          'lastName': lastName,
          'email': email,
          'phone': phone,
          'password': password,
        },
      );

      if (res['success'] == true) {
        _token = res['token'];
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', _token!);
        await fetchProfile();
        return null;
      }
      return res['message'] ?? 'Registration failed';
    } catch (e) {
      return 'Connection error. Please try again.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchProfile() async {
    if (_token == null) return;
    try {
      final res = await ApiService.post(
        ApiConfig.userProfile,
        token: _token,
      );
      if (res['success'] == true && res['user'] != null) {
        _user = User.fromJson(res['user']);
        notifyListeners();
      }
    } catch (_) {}
  }

  Future<String?> editProfile({
    required String firstName,
    required String lastName,
    required String email,
    required String phone,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      final res = await ApiService.post(
        ApiConfig.userEditProfile,
        body: {
          'firstName': firstName,
          'lastName': lastName,
          'email': email,
          'phone': phone,
        },
        token: _token,
      );

      if (res['success'] == true) {
        if (res['user'] != null) {
          _user = User.fromJson(res['user']);
        }
        return null;
      }
      return res['message'] ?? 'Update failed';
    } catch (e) {
      return 'Connection error. Please try again.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<String?> changePassword({
    required String oldPassword,
    required String newPassword,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      final res = await ApiService.post(
        ApiConfig.userChangePassword,
        body: {
          'oldPassword': oldPassword,
          'newPassword': newPassword,
        },
        token: _token,
      );

      if (res['success'] == true) return null;
      return res['message'] ?? 'Password change failed';
    } catch (e) {
      return 'Connection error. Please try again.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    _token = null;
    _user = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    notifyListeners();
  }
}
