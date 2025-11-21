const express = require("express");
const {
  createBillingDetail,
} = require("../controllers/billingdetailController");

const router = express.Router();

// Route to create a new billing detail
router.post("/billingdetail", createBillingDetail);

module.exports = router;

