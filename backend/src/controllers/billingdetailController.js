const { BillingDetail } = require("../models/index");

// Create a new billing detail
const createBillingDetail = async (req, res) => {
  try {
    const { gst_no, registered_name, city, state, id_users } = req.body;

    // Validate required fields
    if (!registered_name || !city || !state || !gst_no) {
      return res
        .status(400)
        .json({ error: "registered_name, city, and state are required" });
    }

    // Insert data into the database
    const newBillingDetail = await BillingDetail.create({
      gst_no,
      registered_name,
      city,
      state,
      id_users,
    });

    
    return res.status(201).json({
      message: "Billing detail created successfully",
      data: newBillingDetail,
    });
  } catch (error) {
    console.error("Error creating billing detail:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createBillingDetail };
