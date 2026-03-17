import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/cart_provider.dart';
import '../auth/login_screen.dart';
import '../order/orders_screen.dart';
import '../about/about_screen.dart';
import '../contact/contact_screen.dart';
import '../privacy/privacy_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    if (!auth.isLoggedIn) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.person_outline_rounded,
                size: 80, color: Colors.grey[300]),
            const SizedBox(height: 16),
            const Text(
              'Welcome to ShopNest',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: AppTheme.textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Login to manage your account',
              style: TextStyle(color: AppTheme.textSecondary),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const LoginScreen()),
              ),
              child: const Text('Login / Sign Up'),
            ),
          ],
        ),
      );
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _buildProfileHeader(auth),
        const SizedBox(height: 24),
        _buildSection('Account', [
          _menuItem(
            Icons.person_outline_rounded,
            'Edit Profile',
            () => _showEditProfile(context),
          ),
          _menuItem(
            Icons.lock_outline_rounded,
            'Change Password',
            () => _showChangePassword(context),
          ),
          _menuItem(
            Icons.receipt_long_outlined,
            'My Orders',
            () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => Scaffold(
                appBar: AppBar(title: const Text('My Orders')),
                body: const OrdersScreen(),
              )),
            ),
          ),
        ]),
        const SizedBox(height: 16),
        _buildSection('Information', [
          _menuItem(
            Icons.info_outline_rounded,
            'About Us',
            () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const AboutScreen()),
            ),
          ),
          _menuItem(
            Icons.mail_outline_rounded,
            'Contact Us',
            () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const ContactScreen()),
            ),
          ),
          _menuItem(
            Icons.privacy_tip_outlined,
            'Privacy Policy',
            () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const PrivacyScreen()),
            ),
          ),
        ]),
        const SizedBox(height: 16),
        _buildSection('', [
          _menuItem(
            Icons.logout_rounded,
            'Logout',
            () async {
              await auth.logout();
              if (context.mounted) {
                context.read<CartProvider>().clearCart();
              }
            },
            color: AppTheme.error,
          ),
        ]),
      ],
    );
  }

  Widget _buildProfileHeader(AuthProvider auth) {
    final user = auth.user;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppTheme.primary, Color(0xFF16213E)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 30,
            backgroundColor: Colors.white.withValues(alpha: 0.2),
            child: Text(
              user != null && user.firstName.isNotEmpty
                  ? user.firstName[0].toUpperCase()
                  : 'U',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  user != null
                      ? '${user.firstName} ${user.lastName}'
                      : 'User',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  user?.email ?? '',
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSection(String title, List<Widget> items) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(bottom: 8, left: 4),
            child: Text(
              title,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: AppTheme.textSecondary,
              ),
            ),
          ),
        Container(
          decoration: BoxDecoration(
            color: AppTheme.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppTheme.border, width: 0.5),
          ),
          child: Column(children: items),
        ),
      ],
    );
  }

  Widget _menuItem(IconData icon, String label, VoidCallback onTap,
      {Color? color}) {
    return ListTile(
      leading: Icon(icon, color: color ?? AppTheme.textPrimary, size: 22),
      title: Text(
        label,
        style: TextStyle(
          fontSize: 15,
          color: color ?? AppTheme.textPrimary,
          fontWeight: FontWeight.w500,
        ),
      ),
      trailing: Icon(Icons.chevron_right_rounded,
          color: color ?? AppTheme.textSecondary, size: 22),
      onTap: onTap,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    );
  }

  void _showEditProfile(BuildContext context) {
    final auth = context.read<AuthProvider>();
    final user = auth.user;
    if (user == null) return;

    final firstName = TextEditingController(text: user.firstName);
    final lastName = TextEditingController(text: user.lastName);
    final email = TextEditingController(text: user.email);
    final phone = TextEditingController(text: user.phone);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: EdgeInsets.fromLTRB(
            24, 24, 24, MediaQuery.of(ctx).viewInsets.bottom + 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Edit Profile',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: firstName,
              decoration: const InputDecoration(hintText: 'First Name'),
              textCapitalization: TextCapitalization.words,
            ),
            const SizedBox(height: 12),
            TextField(
              controller: lastName,
              decoration: const InputDecoration(hintText: 'Last Name'),
              textCapitalization: TextCapitalization.words,
            ),
            const SizedBox(height: 12),
            TextField(
              controller: email,
              decoration: const InputDecoration(hintText: 'Email'),
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 12),
            TextField(
              controller: phone,
              decoration: const InputDecoration(hintText: 'Phone'),
              keyboardType: TextInputType.phone,
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () async {
                  final err = await auth.editProfile(
                    firstName: firstName.text.trim(),
                    lastName: lastName.text.trim(),
                    email: email.text.trim(),
                    phone: phone.text.trim(),
                  );
                  if (!ctx.mounted) return;
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(err ?? 'Profile updated!'),
                      backgroundColor:
                          err != null ? AppTheme.error : AppTheme.success,
                    ),
                  );
                },
                child: const Text('Save Changes'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showChangePassword(BuildContext context) {
    final auth = context.read<AuthProvider>();
    final oldPwd = TextEditingController();
    final newPwd = TextEditingController();
    final confirmPwd = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: EdgeInsets.fromLTRB(
            24, 24, 24, MediaQuery.of(ctx).viewInsets.bottom + 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Change Password',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: oldPwd,
              obscureText: true,
              decoration: const InputDecoration(hintText: 'Current Password'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: newPwd,
              obscureText: true,
              decoration: const InputDecoration(hintText: 'New Password'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: confirmPwd,
              obscureText: true,
              decoration:
                  const InputDecoration(hintText: 'Confirm New Password'),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () async {
                  if (newPwd.text.length < 8) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Password must be at least 8 characters'),
                        backgroundColor: AppTheme.warning,
                      ),
                    );
                    return;
                  }
                  if (newPwd.text != confirmPwd.text) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Passwords do not match'),
                        backgroundColor: AppTheme.warning,
                      ),
                    );
                    return;
                  }
                  final err = await auth.changePassword(
                    oldPassword: oldPwd.text,
                    newPassword: newPwd.text,
                  );
                  if (!ctx.mounted) return;
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(err ?? 'Password changed!'),
                      backgroundColor:
                          err != null ? AppTheme.error : AppTheme.success,
                    ),
                  );
                },
                child: const Text('Change Password'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
