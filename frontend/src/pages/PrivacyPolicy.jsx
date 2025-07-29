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
            At ShopNest, we collect the following information to provide a
            seamless shopping experience:
            <ul className="list-disc ml-6 mt-2">
              <li>
                Personal Information: Your name, email address, delivery
                address, and payment details when you place an order.
              </li>
              <li>
                Product Preferences: Data on products you browse, filter, sort,
                or add to your cart, including selected variants (e.g., size or
                color).
              </li>
              <li>
                Payment Data: Information processed through secure payment
                gateways like Stripe or Chapa for online transactions, or your
                cash-on-delivery preferences.
              </li>
            </ul>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            2. How We Use Your Information
          </h2>
          <p className="text-gray-700">
            We use your information to enhance your shopping experience by:
            <ul className="list-disc ml-6 mt-2">
              <li>Processing and delivering your orders efficiently.</li>
              <li>
                Providing prompt customer support and addressing your inquiries.
              </li>
              <li>
                Personalizing your experience based on your product preferences
                and browsing history.
              </li>
              <li>
                Facilitating secure payments through Stripe, Chapa, or
                cash-on-delivery options.
              </li>
              <li>
                Continuously improving our website, services, and product
                offerings.
              </li>
            </ul>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">3. Data Sharing</h2>
          <p className="text-gray-700">
            We share your information only when necessary, such as with:
            <ul className="list-disc ml-6 mt-2">
              <li>
                Trusted payment processors (Stripe and Chapa) to securely handle
                online transactions.
              </li>
              <li>
                Reliable delivery services to ensure timely order fulfillment.
              </li>
              <li>
                Legal authorities, if required, to comply with applicable laws.
              </li>
            </ul>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">4. Data Security</h2>
          <p className="text-gray-700">
            We prioritize your data’s safety with robust security measures,
            including encryption for payment processing. While we strive to
            protect your information, please note that no online transmission
            can be guaranteed as completely secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">5. Your Rights</h2>
          <p className="text-gray-700">
            You have control over your data and the right to:
            <ul className="list-disc ml-6 mt-2">
              <li>
                Access, update, or request deletion of your personal
                information.
              </li>
              <li>
                Opt out of marketing emails or promotional communications.
              </li>
              <li>
                Request details about how your data is processed and used.
              </li>
            </ul>
            To exercise these rights, contact us at support@shopnest.com.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            6. Cookies and Tracking
          </h2>
          <p className="text-gray-700">
            We use cookies to improve your browsing experience and analyze usage
            trends. You can customize cookie preferences directly through your
            browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">7. Third-Party Links</h2>
          <p className="text-gray-700">
            Our website may include links to third-party platforms (e.g.,
            Stripe, Chapa). We are not responsible for the privacy practices of
            these external sites.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            8. Changes to This Policy
          </h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time to reflect
            changes in our practices. Updates will be posted here with the
            revised date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">9. Contact Us</h2>
          <p className="text-gray-700">
            For any questions or concerns about this Privacy Policy, please
            reach out to us at support@shopnest.com or (123) 456-7890.
          </p>
        </section>
      </div>
    </div>
  );
};
export default PrivacyPolicy;
