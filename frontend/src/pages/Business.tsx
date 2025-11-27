import React, {useEffect} from "react";
import TermsAndConditions from "./TermsAndConditions";
import PrivacyPolicy from "./PrivacyPolicy";
import CampaignSettingTab from "../components/common/businesstab-page/CampaignSettingTab";

type BusinessProps = {};

const Business: React.FC<BusinessProps> = ({}) => {
  useEffect(() => {
    const tabs = document.querySelectorAll(".nav-tabs .nav-link");

    tabs.forEach((tab) => {
      tab.addEventListener("shown.bs.tab", function () {
        const glider = document.querySelector(".glider");
        const index = this.getAttribute("data-index");
        glider.style.transform = `translateX(${index * 195}px)`;
      });
    });
  }, []);

  return (
    <div className="content p-0 my-5">
      <div className="container">
        <div className="row g-20">
          <div className="col-md-12">
            <div className="business-details">
              <div className="tabs-wrapper position-relative">
                <ul className=" nav nav-tabs  custom-tabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      data-index="0"
                      data-bs-toggle="tab"
                      data-bs-target="#CampaignSettingTab"
                    >
                      <span className="nav-link-icon me-2">
                        <img
                          src="assets/images/campaign.svg"
                          className="icon-default"
                          style={{ height: "26px", width: "32px" }}
                        />
                        <img
                          src="assets/images/campaign-hover.svg"
                          className="icon-hover"
                          style={{ height: "26px", width: "32px" }}
                        />
                      </span>
                      Campaign Setting
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      data-index="1"
                      data-bs-toggle="tab"
                      data-bs-target="#BillingDetailsTab"
                    >
                      <span className="nav-link-icon me-2">
                        <img
                          src="assets/images/billing.svg"
                          className="icon-default"
                          style={{ height: "26px", width: "32px" }}
                        />
                        <img
                          src="assets/images/billing-hover.svg"
                          className="icon-hover"
                          style={{ height: "26px", width: "32px" }}
                        />
                      </span>
                      Billing Details
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      data-index="2"
                      data-bs-toggle="tab"
                      data-bs-target="#PaymentInvoicesTab"
                    >
                      <span className="nav-link-icon me-2">
                        <img
                          src="assets/images/payement-invoice.svg
                        "
                          className="icon-default"
                          style={{ height: "26px", width: "32px" }}
                        />
                        <img
                          src="assets/images/payement-invoice-hover.svg"
                          className="icon-hover"
                          style={{ height: "26px", width: "32px" }}
                        />
                      </span>
                      Payment & Invoices
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      data-index="3"
                      data-bs-toggle="tab"
                      data-bs-target="#SupportTab"
                    >
                      <span className="nav-link-icon me-2">
                        <img
                          src="assets/images/support.svg"
                          className="icon-default"
                          style={{ height: "26px", width: "32px" }}
                        />
                        <img
                          src="assets/images/support-hover.svg"
                          className="icon-hover"
                          style={{ height: "26px", width: "32px" }}
                        />
                      </span>
                      Support
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      data-index="4"
                      data-bs-toggle="tab"
                      data-bs-target="#NotificationTab"
                    >
                      <span className="nav-link-icon me-2">
                        <img
                          src="assets/images/notification.svg"
                          className="icon-default"
                          style={{ height: "26px", width: "32px" }}
                        />
                        <img
                          src="assets/images/notification-hover.svg"
                          className="icon-hover"
                          style={{ height: "26px", width: "32px" }}
                        />
                      </span>
                      Notification
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      data-index="5"
                      data-bs-toggle="tab"
                      data-bs-target="#TermsConditionTab"
                    >
                      <span className="nav-link-icon me-2">
                        <img
                          src="assets/images/terms.svg"
                          className="icon-default"
                          style={{ height: "26px", width: "32px" }}
                        />
                        <img
                          src="assets/images/terms-hover.svg"
                          className="icon-hover"
                          style={{ height: "26px", width: "32px" }}
                        />
                      </span>
                      Terms & Conditions
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      data-index="6"
                      data-bs-toggle="tab"
                      data-bs-target="#PrivacyPolicyTab"
                    >
                      <span className="nav-link-icon me-2">
                        <img
                          src="assets/images/privacy.svg"
                          className="icon-default"
                          style={{ height: "26px", width: "32px" }}
                        />
                        <img
                          src="assets/images/privacy-hover.svg"
                          className="icon-hover"
                          style={{ height: "26px", width: "32px" }}
                        />
                      </span>
                      Privacy Policy
                    </button>
                  </li>
                  <span className="glider"></span>
                </ul>
              </div>

              <div className="tab-content">
                <div className="tab-pane active" id="CampaignSettingTab">
                  <CampaignSettingTab />
                </div>
                <div className="tab-pane" id="BillingDetailsTab">
                  <form>
                    <div className="row g-20">
                      <div className="col-md-6 col-xl-4">
                        <label htmlFor="GST_no" className="form-label">
                          GST Number{" "}
                          <span className="text-body-tertiary small">
                            (Required)
                          </span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="GST_no"
                          placeholder="Enter GST Number"
                          required
                        />
                      </div>
                      <div className="col-md-6 col-xl-4">
                        <label htmlFor="registered_name" className="form-label">
                          Registered Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="registered_name"
                          placeholder="Enter your registered name"
                        />
                      </div>
                      <div className="col-md-6 col-xl-4 d-none d-xl-block"></div>
                      <div className="col-md-6 col-xl-4">
                        <label htmlFor="city_name" className="form-label">
                          City
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="city_name"
                          placeholder="Enter City Name"
                        />
                      </div>
                      <div className="col-md-6 col-xl-4">
                        <label htmlFor="State" className="form-label">
                          State
                        </label>
                        <select className="form-select">
                          <option value="Gujarat">Gujarat</option>
                          <option value="Delhi">Delhi</option>
                        </select>
                      </div>
                      <div className="col-md-6 mt-5">
                        <a
                          href="#"
                          className="btn btn-primary w-25"
                          type="submit"
                        >
                          Save
                        </a>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="tab-pane" id="PaymentInvoicesTab">
                  <form>
                    <div className="row g-20">
                      <div className="col-md-6 col-xl-4">
                        <div className="mb-30">
                          <input
                            type="text"
                            className="form-control"
                            id="nameOnCard"
                            placeholder="Name on card"
                          />
                        </div>
                        <div className="mb-30">
                          <input
                            type="text"
                            className="form-control"
                            id="cardValid"
                            placeholder="Valid thru(MM/YY)"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-check mb-30 ps-0 d-flex align-items-center">
                      <input
                        className="form-check-input small"
                        type="checkbox"
                        name="saveCardDetail"
                        id="saveCardDetail"
                      />
                      <label
                        className="form-check-label text-body-tertiary ff-medium"
                        htmlFor="saveCardDetail"
                      >
                        Save card details
                      </label>
                    </div>
                    <a
                      href="payment-success.html"
                      className="btn btn-primary d-inline-flex mb-32"
                      type="submit"
                    >
                      Pay now
                    </a>
                    <p className="text-body-tertiary">
                      Your personal data will be used to process your order,
                      support your experience throughout this website, and for
                      other purposes described in our privacy policy.
                    </p>
                  </form>
                </div>
                <div className="tab-pane" id="SupportTab">
                  <h5 className="mb-5 text-primary">
                    Frequently Asked Questions
                  </h5>
                  <div className="accordion" id="supportFAQ">
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="faqSix">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseSix"
                        >
                          What if I don’t have a Facebook Ad Account?
                        </button>
                      </h2>
                      <div
                        id="collapseSix"
                        className="accordion-collapse collapse"
                        data-bs-parent="#supportFAQ"
                      >
                        <div className="accordion-body">
                          No problem! Just connect your Facebook Page, and we’ll
                          run ads using one of our verified Ad Accounts. This
                          lets you get started instantly without setup delays.
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item">
                      <h2 className="accordion-header" id="faqSeven">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseSeven"
                        >
                          Do I need to be a Facebook Business Manager admin?
                        </button>
                      </h2>
                      <div
                        id="collapseSeven"
                        className="accordion-collapse collapse"
                        data-bs-parent="#supportFAQ"
                      >
                        <div className="accordion-body">
                          Not necessarily. As long as you have access to a Page
                          and accept the permissions during login, you’re good
                          to go. We handle the technical part for you.
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item">
                      <h2 className="accordion-header" id="faqEight">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseEight"
                        >
                          How long does it take for my ad to go live?
                        </button>
                      </h2>
                      <div
                        id="collapseEight"
                        className="accordion-collapse collapse"
                        data-bs-parent="#supportFAQ"
                      >
                        <div className="accordion-body">
                          Once you submit your ad, it typically takes 15–60
                          minutes for Facebook to review and approve it. You'll
                          see the live status reflected in your dashboard.
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item">
                      <h2 className="accordion-header" id="faqNine">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseNine"
                        >
                          Can I edit or pause my ad after it starts?
                        </button>
                      </h2>
                      <div
                        id="collapseNine"
                        className="accordion-collapse collapse"
                        data-bs-parent="#supportFAQ"
                      >
                        <div className="accordion-body">
                          Yes! You can edit ad text, budget, or schedule, or
                          even pause/resume your ad anytime from the campaign
                          manager section.
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item">
                      <h2 className="accordion-header" id="faqTwo">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseTwo"
                        >
                          Why do I see a limit of only 10 campaigns?
                        </button>
                      </h2>
                      <div
                        id="collapseTwo"
                        className="accordion-collapse collapse"
                        data-bs-parent="#supportFAQ"
                      >
                        <div className="accordion-body">
                          Meta allows only 10 active campaigns per ad account by
                          default. You can pause old ones or request an account
                          upgrade from Meta to increase the limit.
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item">
                      <h2 className="accordion-header" id="faqThree">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseThree"
                        >
                          Can I use someone else’s ad account to run ads?
                        </button>
                      </h2>
                      <div
                        id="collapseThree"
                        className="accordion-collapse collapse"
                        data-bs-parent="#supportFAQ"
                      >
                        <div className="accordion-body">
                          Yes, if they grant you access. You can run ads using
                          any account you have valid token permissions for — no
                          need to be added as a Business Manager partner.
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="faqTen">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseTen"
                        >
                          Will I be charged immediately when I submit an ad?
                        </button>
                      </h2>
                      <div
                        id="collapseTen"
                        className="accordion-collapse collapse"
                        data-bs-parent="#supportFAQ"
                      >
                        <div className="accordion-body">
                          No, Facebook charges you only after your ad starts
                          delivering and spends your budget. You’ll be billed
                          based on Facebook’s billing cycle.
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item">
                      <h2 className="accordion-header" id="faqEleven">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseEleven"
                        >
                          How do I track the performance of my ads?
                        </button>
                      </h2>
                      <div
                        id="collapseEleven"
                        className="accordion-collapse collapse"
                        data-bs-parent="#supportFAQ"
                      >
                        <div className="accordion-body">
                          You can view real-time performance metrics like reach,
                          clicks, and conversions directly in the dashboard
                          under the “My Campaigns” section.
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item">
                      <h2 className="accordion-header" id="faqTwelve">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseTwelve"
                        >
                          What happens if my Facebook token expires?
                        </button>
                      </h2>
                      <div
                        id="collapseTwelve"
                        className="accordion-collapse collapse"
                        data-bs-parent="#supportFAQ"
                      >
                        <div className="accordion-body">
                          If your token expires, your access will be revoked
                          temporarily. You’ll simply need to log in again with
                          Facebook to refresh your permissions.
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item">
                      <h2 className="accordion-header" id="faqThirteen">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseThirteen"
                        >
                          Can I duplicate an existing campaign?
                        </button>
                      </h2>
                      <div
                        id="collapseThirteen"
                        className="accordion-collapse collapse"
                        data-bs-parent="#supportFAQ"
                      >
                        <div className="accordion-body">
                          Yes! You can duplicate a previous campaign with all
                          settings pre-filled. Just go to “My Campaigns,” click
                          the options menu, and select “Duplicate.”
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab-pane" id="NotificationTab">
                  <form>
                    <div className="row g-20">
                      <div className="col-md-6 col-xl-4">
                        <div className="input-group mb-30">
                          <input
                            type="text"
                            className="form-control"
                            id="CardNo"
                            placeholder="Card Number"
                          />
                          <span className="input-group-text">
                            <i className="fa fa-credit-card"></i>
                          </span>
                        </div>
                        <div className="mb-30">
                          <input
                            type="text"
                            className="form-control"
                            id="nameOnCard"
                            placeholder="Name on card"
                          />
                        </div>
                        <div className="mb-30">
                          <input
                            type="text"
                            className="form-control"
                            id="cardValid"
                            placeholder="Valid thru(MM/YY)"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-check mb-30 ps-0 d-flex align-items-center">
                      <input
                        className="form-check-input small"
                        type="checkbox"
                        name="saveCardDetail"
                        id="saveCardDetail"
                      />
                      <label
                        className="form-check-label text-body-tertiary ff-medium"
                        htmlFor="saveCardDetail"
                      >
                        Save card details
                      </label>
                    </div>
                    <a
                      href="payment-success.html"
                      className="btn btn-primary d-inline-flex mb-32"
                      type="submit"
                    >
                      Pay now
                    </a>
                    <p className="text-body-tertiary">
                      Your personal data will be used to process your order,
                      support your experience throughout this website, and for
                      other purposes described in our privacy policy.
                    </p>
                  </form>
                </div>

                <div className="tab-pane" id="TermsConditionTab">
                  <TermsAndConditions />
                </div>
                <div className="tab-pane" id="PrivacyPolicyTab">
                  <PrivacyPolicy />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Business;
