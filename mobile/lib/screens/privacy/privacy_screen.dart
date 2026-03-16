import 'package:flutter/material.dart';
import '../../config/theme.dart';

class PrivacyScreen extends StatelessWidget {
  const PrivacyScreen({super.key});

  static const _sections = [
    {
      'title': '1. Information We Collect',
      'content':
          'We collect personal information such as your name, email address, phone number, shipping address, and payment details when you create an account or place an order.',
    },
    {
      'title': '2. How We Use Your Information',
      'content':
          'We use the information to process orders, manage your account, improve our services, send promotional offers (with your consent), and communicate important updates.',
    },
    {
      'title': '3. Information Sharing',
      'content':
          'We do not sell your personal information. We may share it with trusted third-party service providers for payment processing, shipping, and analytics purposes.',
    },
    {
      'title': '4. Data Security',
      'content':
          'We implement industry-standard security measures to protect your personal data, including encryption and secure servers.',
    },
    {
      'title': '5. Your Rights',
      'content':
          'You have the right to access, correct, or delete your personal data at any time. Contact us to exercise these rights.',
    },
    {
      'title': '6. Cookies',
      'content':
          'We use cookies to improve your browsing experience and analyze site traffic. You can manage cookie preferences in your device settings.',
    },
    {
      'title': '7. Third-Party Links',
      'content':
          'Our app may contain links to external websites. We are not responsible for the privacy practices of those sites.',
    },
    {
      'title': '8. Children\'s Privacy',
      'content':
          'Our services are not intended for children under 13. We do not knowingly collect personal information from children.',
    },
    {
      'title': '9. Changes to This Policy',
      'content':
          'We may update this privacy policy from time to time. We will notify you of any significant changes via email or in-app notification.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Privacy Policy')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            'Privacy Policy',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Last updated: March 2026',
            style: TextStyle(
              fontSize: 13,
              color: AppTheme.textSecondary,
            ),
          ),
          const SizedBox(height: 20),
          ..._sections.map((s) => Padding(
                padding: const EdgeInsets.only(bottom: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      s['title']!,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      s['content']!,
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppTheme.textSecondary,
                        height: 1.6,
                      ),
                    ),
                  ],
                ),
              )),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
