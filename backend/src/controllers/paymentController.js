const { PaymentDetail , AdDraft} = require("../models/index");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const createAdFlow = require("../helper/adFlowHelpers");


exports.createOrder = async (req, res) => {
  try {
    console.log("Received order request:", req.body); // Log request body

    const options = {
      amount: req.body.amount * 100, // Convert INR to paisa
      currency: "INR",
      receipt: `order_${Date.now()}`,
      payment_capture: 1,
    };
    console.log("Creating order with options:", options);

    const order = await razorpay.orders.create(options);
    console.log("Order created successfully:", order); // Log order response

    res.json(order);
  } catch (error) {
    console.error("Error creating order:", error); // Log error details
    res.status(500).json({ error: error.message });
  }
};


exports.verifyPayment = async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//     req.body;

   const userId = req.user.id; 
   const workspaceId = req.user.currentWorkspaceId;
   console.log("userid, workspaceId", userId, workspaceId);

//   const generatedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//     .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//     .digest("hex");

//   const paymentStatus = generatedSignature === razorpay_signature;

//   // Store payment details in the database
//   const paymentDetail = await PaymentDetail.create({
//     payment_id: razorpay_payment_id,
//     status: paymentStatus, // true if success, false if failed
//     id_users: userId,
//   });

//   console.log(paymentDetail);

//  if (!paymentStatus) {
//     return res.status(400).json({ success: false, message: "Payment verification failed" });
//   }

  // ✅ Now run the ad flow
  try {
   
const adFormData = await AdDraft.findOne({
  where: {
    id_users: userId,
    workspaceId: workspaceId,
  },
  order: [['createdAt', 'DESC']], // fetch the latest one
});
    
       let metadata = adFormData.metadata;
if (typeof metadata === "string") {
  try {
    metadata = JSON.parse(metadata);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Metadata in DB is corrupted or not valid JSON",
    });
  }
}
    const imagePath = adFormData.image_path;

     console.log("Meta Data in Payment Controller", metadata);

    const result = await createAdFlow({  metadata, imagePath, workspaceId, userId  });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Payment verified and ad created successfully",
        ...result,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Ad creation failed after payment",
        error: result.error,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong during ad creation",
      error: error.message,
    });
  }
};
