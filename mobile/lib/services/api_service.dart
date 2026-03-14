import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static Future<Map<String, dynamic>> get(
    String url, {
    String? token,
  }) async {
    final headers = <String, String>{
      'Content-Type': 'application/json',
    };
    if (token != null) headers['token'] = token;

    final response = await http.get(Uri.parse(url), headers: headers);
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> post(
    String url, {
    Map<String, dynamic>? body,
    String? token,
  }) async {
    final headers = <String, String>{
      'Content-Type': 'application/json',
    };
    if (token != null) headers['token'] = token;

    final response = await http.post(
      Uri.parse(url),
      headers: headers,
      body: jsonEncode(body ?? {}),
    );
    return jsonDecode(response.body);
  }
}
