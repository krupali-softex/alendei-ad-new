import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container">
      {/* <h1 className="mb-5 text-primary ff-semibold">Privacy Policy</h1> */}
      <p>
        At <strong>Alendei</strong>, we value your privacy and are committed to
        protecting the personal information you share with us. This Privacy
        Policy explains how we collect, use, and safeguard your information when
        you use our platform to connect your Facebook Page and run ads using our
        services. By using our app or website, you agree to the terms described
        here.
      </p>

      <h4 className="mt-4 mb-2">Information We Collect</h4>
      <p>We collect personal and business information you provide when you:</p>
      <ul>
        <li>Sign up for our platform.</li>
        <li>Connect your Facebook Page to our app.</li>
        <li>Grant permissions via Meta’s login flow.</li>
      </ul>
      <p>This may include your:</p>
      <ul>
        <li>Name and email address.</li>
        <li>Facebook Page name and Page ID.</li>
        <li>
          Meta access tokens necessary to manage and post ads on your behalf.
        </li>
        <li>
          Any other information you voluntarily provide through forms or
          settings.
        </li>
      </ul>

      <h4 className="mt-4 mb-2">Use of Information</h4>
      <p>We use the collected information to:</p>
      <ul>
        <li>Request and manage your Facebook Page as a business asset.</li>
        <li>
          Run ads for your Page using our own ad account, as per your consent.
        </li>
        <li>
          Provide performance reports, insights, and analytics about your
          campaigns.
        </li>
        <li>Communicate with you regarding your campaigns and account.</li>
        <li>Improve and optimize our platform.</li>
      </ul>

      <h4 className="mt-4 mb-2">Disclosure of Information</h4>
      <p>
        We do <strong>not</strong> sell your personal or business data. We may
        share your information only in the following cases:
      </p>
      <ul>
        <li>
          With Meta Platforms, Inc., for managing your Page and running ads on
          your behalf.
        </li>
        <li>
          With trusted service providers who help us deliver our platform
          features.
        </li>
        <li>If required by law, legal processes, or governmental requests.</li>
        <li>
          During a company merger, acquisition, or sale, in which case we will
          notify you in advance.
        </li>
      </ul>

      <h4 className="mt-4 mb-2">Security</h4>
      <p>
        We take appropriate technical and organizational measures to safeguard
        your data, including secure token storage and encrypted communication.
        However, no internet transmission is entirely secure, so we cannot
        guarantee absolute security.
      </p>

      <h4 className="mt-4 mb-2">Children’s Privacy</h4>
      <p>
        Our services are not intended for individuals under the age of 13. We do
        not knowingly collect personal data from children.
      </p>

      <h4 className="mt-4 mb-2">Changes to This Privacy Policy</h4>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be
        posted with a revised effective date.
      </p>

      <h4 className="mt-4 mb-2">Contact Us</h4>
      <p>
        If you have any questions about this Privacy Policy or how your data is
        used, you can contact us at:{" "}
        <a href="mailto:care@alendei.com">care@alendei.com</a>
      </p>

      <p className="mt-4 text-muted">Effective Date: 06-08-2025</p>
    </div>
  );
};

export default PrivacyPolicy;
