const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-4xl font-bold text-center mb-6">Privacy Policy</h1>
      <p className="text-gray-600 text-sm text-center mb-4">
        Last Updated: July 12, 2025
      </p>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            1. Information We Collect
          </h2>
          <p className="text-gray-700">
            We collect the following information:
            <ul className="list-disc ml-6 mt-2">
              <li>
                Personal Information: Name, email address, delivery address, and
                payment details when you place an order.
              </li>
              <li>
                Product Preferences: Information about products you explore,
                filter, sort, or add to your cart, including selected variants
                (e.g., size).
              </li>
              <li>
                Payment Data: Details processed through Stripe or Chapa for
                online payments, or cash-on-delivery preferences.
              </li>
            </ul>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            2. How We Use Your Information
          </h2>
          <p className="text-gray-700">
            We use your information to:
            <ul className="list-disc ml-6 mt-2">
              <li>Process and deliver your orders.</li>
              <li>Provide customer support and respond to inquiries.</li>
              <li>
                Personalize your shopping experience based on product
                preferences.
              </li>
              <li>
                Facilitate payments via Stripe and Chapa or cash-on-delivery.
              </li>
              <li>Improve our website and services.</li>
            </ul>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">3. Data Sharing</h2>
          <p className="text-gray-700">
            We may share your information with:
            <ul className="list-disc ml-6 mt-2">
              <li>
                Payment processors (Stripe and Chapa) to handle online
                transactions.
              </li>
              <li>Delivery services to fulfill your orders.</li>
              <li>Legal authorities if required by law.</li>
            </ul>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">4. Data Security</h2>
          <p className="text-gray-700">
            We implement reasonable security measures to protect your data,
            including encryption for payment processing. However, no online
            transmission is fully secure, and we cannot guarantee absolute
            security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">5. Your Rights</h2>
          <p className="text-gray-700">
            You have the right to:
            <ul className="list-disc ml-6 mt-2">
              <li>Access, update, or delete your personal information.</li>
              <li>Opt-out of marketing communications.</li>
              <li>Request details on how your data is processed.</li>
            </ul>
            To exercise these rights, contact us at [Your Contact Email].
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            6. Cookies and Tracking
          </h2>
          <p className="text-gray-700">
            We use cookies to enhance your browsing experience and track usage
            patterns. You can manage cookie preferences through your browser
            settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">7. Third-Party Links</h2>
          <p className="text-gray-700">
            Our site may contain links to third-party websites (e.g., Stripe,
            Chapa). We are not responsible for their privacy practices.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            8. Changes to This Policy
          </h2>
          <p className="text-gray-700">
            We may update this Privacy Policy periodically. Changes will be
            posted here with the updated date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">9. Contact Us</h2>
          <p className="text-gray-700">
            For questions or concerns, reach out to us at [Your Contact Email]
            or [Your Phone Number].
          </p>
        </section>
      </div>
    </div>
  );
};
export default PrivacyPolicy;
