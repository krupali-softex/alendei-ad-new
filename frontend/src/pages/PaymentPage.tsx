import React from "react";

type PaymentPageProps = {};

const PaymentPage: React.FC<PaymentPageProps> = ({}) => {
  return (
    <div className="content py-5">
      <div className="container">
        <div className="row gx-80">
          <div className="col-lg-7 col-md-6">
            <h2 className="subtitle mb-30">Select Payment Method</h2>
            <div className="payment-card">
              <ul className=" nav nav-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="CreditCard-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#CreditCard"
                    type="button"
                    role="tab"
                    aria-controls="CreditCard"
                    aria-selected="true"
                  >
                    Credit Card
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="DebitCard-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#DebitCard"
                    type="button"
                    role="tab"
                    aria-controls="DebitCard"
                    aria-selected="false"
                  >
                    Debit Card
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="QR-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#QR"
                    type="button"
                    role="tab"
                    aria-controls="QR"
                    aria-selected="false"
                  >
                    QR Code / UPI
                  </button>
                </li>
              </ul>
              <div className="tab-content">
                <div
                  className="tab-pane active"
                  id="CreditCard"
                  role="tabpanel"
                  aria-labelledby="CreditCard-tab"
                >
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

                <div
                  className="tab-pane"
                  id="DebitCard"
                  role="tabpanel"
                  aria-labelledby="DebitCard-tab"
                >
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
                <div
                  className="tab-pane"
                  id="QR"
                  role="tabpanel"
                  aria-labelledby="QR-tab"
                >
                  <form>
                    <div className="text-center">
                      <img
                        src="https://ads.alendei.com/images/QR.svg"
                        alt="QR"
                        className="mb-30"
                      />
                      <p className="text-body-tertiary">Scan to pay with UPI</p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5 col-md-6">
            <h2 className="subtitle gradient-title gradient-primary mb-30">
              Order Summary
            </h2>
            <div className="order-summary-card">
              <div className="d-flex justify-content-between align-items-center gap-3 mb-30">
                <span>Advertising Cost</span>
                <span>₹ 2200</span>
              </div>
              <div className="d-flex justify-content-between align-items-center gap-3 mb-30">
                <span>Ad Service Fees</span>
                <span>₹ 220</span>
              </div>
              <hr className="border-primary" />
              <div className="d-flex justify-content-between align-items-center gap-3 mt-30">
                <p>
                  <span className="ff-semibold">Total</span>{" "}
                  <small>(Including GST)</small>
                </p>
                <span className="ff-bold">₹ 2420</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
