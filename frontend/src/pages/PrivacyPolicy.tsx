import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="content p-0 my-5">
      <div className="container">
        <div className="table-card p-4 ">
          <h1 className="mb-5 text-primary ff-semibold title-hide text-center">
            Privacy Policy
          </h1>
          <p>
            At <strong>Alendei</strong>, we value your privacy and are committed
            to protecting the personal information you share with us. This
            Privacy Policy explains how we collect, use, and safeguard your
            information when you use our platform to connect your Facebook Page
            and run ads using our services. By using our app or website, you
            agree to the terms described here.
          </p>

          <h5 className="mt-4 mb-2 ff-semibold">Information We Collect</h5>
          <p>
            We collect personal and business information you provide when you:
          </p>
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
              Meta access tokens necessary to manage and post ads on your
              behalf.
            </li>
            <li>
              Any other information you voluntarily provide through forms or
              settings.
            </li>
          </ul>

          <h5 className="mt-4 mb-2 ff-semibold">Use of Information</h5>
          <p>We use the collected information to:</p>
          <ul>
            <li>Request and manage your Facebook Page as a business asset.</li>
            <li>
              Run ads for your Page using our own ad account, as per your
              consent.
            </li>
            <li>
              Provide performance reports, insights, and analytics about your
              campaigns.
            </li>
            <li>Communicate with you regarding your campaigns and account.</li>
            <li>Improve and optimize our platform.</li>
          </ul>

          <h5 className="mt-4 mb-2 ff-semibold">Disclosure of Information</h5>
          <p>
            We do <strong>not</strong> sell your personal or business data. We
            may share your information only in the following cases:
          </p>
          <ul>
            <li>
              With Meta Platforms, Inc., for managing your Page and running ads
              on your behalf.
            </li>
            <li>
              With trusted service providers who help us deliver our platform
              features.
            </li>
            <li>
              If required by law, legal processes, or governmental requests.
            </li>
            <li>
              During a company merger, acquisition, or sale, in which case we
              will notify you in advance.
            </li>
          </ul>

          <h5 className="mt-4 mb-2 ff-semibold">Security</h5>
          <p>
            We take appropriate technical and organizational measures to
            safeguard your data, including secure token storage and encrypted
            communication. However, no internet transmission is entirely secure,
            so we cannot guarantee absolute security.
          </p>

          <h5 className="mt-4 mb-2 ff-semibold">Children’s Privacy</h5>
          <p>
            Our services are not intended for individuals under the age of 13.
            We do not knowingly collect personal data from children.
          </p>

          <h5 className="mt-4 mb-2 ff-semibold">
            Changes to This Privacy Policy
          </h5>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted with a revised effective date.
          </p>

          <h5 className="mt-4 mb-2 ff-semibold">Contact Us</h5>
          <p>
            If you have any questions about this Privacy Policy or how your data
            is used, you can contact us at:{" "}
            <a href="mailto:care@alendei.com">care@alendei.com</a>
          </p>

          <p className="mt-4 text-muted">Effective Date: 06-08-2025</p>
        </div>{" "}
      </div>{" "}
    </div>
  );
};

export default PrivacyPolicy;
