import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/cart_provider.dart';
import '../../providers/order_provider.dart';
import '../../providers/product_provider.dart';
import '../../widgets/cart_total_widget.dart';

class PlaceOrderScreen extends StatefulWidget {
  const PlaceOrderScreen({super.key});

  @override
  State<PlaceOrderScreen> createState() => _PlaceOrderScreenState();
}

class _PlaceOrderScreenState extends State<PlaceOrderScreen> {
  final _formKey = GlobalKey<FormState>();
  String _paymentMethod = 'cod';
  bool _isPlacing = false;

  final _controllers = <String, TextEditingController>{};

  @override
  void initState() {
    super.initState();
    for (final field in [
      'firstName',
      'lastName',
      'email',
      'street',
      'city',
      'state',
      'zipCode',
      'country',
      'phone',
    ]) {
      _controllers[field] = TextEditingController();
    }

    WidgetsBinding.instance.addPostFrameCallback((_) {
      final user = context.read<AuthProvider>().user;
      if (user != null) {
        _controllers['firstName']!.text = user.firstName;
        _controllers['lastName']!.text = user.lastName;
        _controllers['email']!.text = user.email;
        _controllers['phone']!.text = user.phone;
      }
    });
  }

  @override
  void dispose() {
    for (final c in _controllers.values) {
      c.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Checkout')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Delivery Address',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textPrimary,
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(child: _field('firstName', 'First Name')),
                  const SizedBox(width: 12),
                  Expanded(child: _field('lastName', 'Last Name')),
                ],
              ),
              const SizedBox(height: 12),
              _field('email', 'Email', type: TextInputType.emailAddress),
              const SizedBox(height: 12),
              _field('phone', 'Phone', type: TextInputType.phone),
              const SizedBox(height: 12),
              _field('street', 'Street Address'),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(child: _field('city', 'City')),
                  const SizedBox(width: 12),
                  Expanded(child: _field('state', 'State')),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(child: _field('zipCode', 'Zip Code')),
                  const SizedBox(width: 12),
                  Expanded(child: _field('country', 'Country')),
                ],
              ),
              const SizedBox(height: 28),
              const Text(
                'Payment Method',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textPrimary,
                ),
              ),
              const SizedBox(height: 12),
              _paymentOption('cod', 'Cash on Delivery', Icons.money_rounded),
              const SizedBox(height: 8),
              _paymentOption(
                  'stripe', 'Stripe', Icons.credit_card_rounded),
              const SizedBox(height: 8),
              _paymentOption(
                  'chapa', 'Chapa', Icons.account_balance_rounded),
              const SizedBox(height: 24),
              const CartTotalWidget(),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _isPlacing ? null : _placeOrder,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.accent,
                  ),
                  child: _isPlacing
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Text('Place Order'),
                ),
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  Widget _field(String key, String hint, {TextInputType? type}) {
    return TextFormField(
      controller: _controllers[key],
      decoration: InputDecoration(hintText: hint),
      keyboardType: type,
      textCapitalization: type == null ? TextCapitalization.words : TextCapitalization.none,
      validator: (v) => (v?.isEmpty ?? true) ? 'Required' : null,
    );
  }

  Widget _paymentOption(String value, String label, IconData icon) {
    final isSelected = _paymentMethod == value;
    return GestureDetector(
      onTap: () => setState(() => _paymentMethod = value),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected
              ? AppTheme.primary.withValues(alpha: 0.05)
              : AppTheme.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? AppTheme.primary : AppTheme.border,
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Row(
          children: [
            Icon(icon,
                color: isSelected ? AppTheme.primary : AppTheme.textSecondary),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                label,
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                  color: isSelected ? AppTheme.primary : AppTheme.textPrimary,
                ),
              ),
            ),
            if (isSelected)
              const Icon(Icons.check_circle_rounded,
                  color: AppTheme.primary, size: 22),
          ],
        ),
      ),
    );
  }

  Future<void> _placeOrder() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isPlacing = true);

    final address = {
      'firstName': _controllers['firstName']!.text.trim(),
      'lastName': _controllers['lastName']!.text.trim(),
      'email': _controllers['email']!.text.trim(),
      'street': _controllers['street']!.text.trim(),
      'city': _controllers['city']!.text.trim(),
      'state': _controllers['state']!.text.trim(),
      'zipCode': _controllers['zipCode']!.text.trim(),
      'country': _controllers['country']!.text.trim(),
      'phone': _controllers['phone']!.text.trim(),
    };

    final cart = context.read<CartProvider>();
    final products = context.read<ProductProvider>().products;
    final token = context.read<AuthProvider>().token!;
    final cartProducts = cart.getCartProducts(products);
    final amount = cart.getCartTotal(products) + AppTheme.deliveryFee;

    final orderProducts = cartProducts.map((item) {
      final p = item['product'] as dynamic;
      return {
        '_id': p.id,
        'name': p.name,
        'price': p.price,
        'image': p.images,
        'size': item['size'],
        'quantity': item['quantity'],
      };
    }).toList();

    final res = await context.read<OrderProvider>().placeOrder(
          address: address,
          products: orderProducts,
          amount: amount,
          paymentMethod: _paymentMethod,
          token: token,
        );

    if (!mounted) return;
    setState(() => _isPlacing = false);

    if (res['success'] == true) {
      if (_paymentMethod == 'cod') {
        cart.clearCart();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Order placed successfully!'),
            backgroundColor: AppTheme.success,
          ),
        );
        Navigator.of(context).popUntil((route) => route.isFirst);
      } else if (res['session_url'] != null) {
        final url = Uri.parse(res['session_url']);
        if (await canLaunchUrl(url)) {
          await launchUrl(url, mode: LaunchMode.externalApplication);
        }
        if (mounted) {
          cart.clearCart();
          Navigator.of(context).popUntil((route) => route.isFirst);
        }
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(res['message'] ?? 'Failed to place order'),
          backgroundColor: AppTheme.error,
        ),
      );
    }
  }
}
