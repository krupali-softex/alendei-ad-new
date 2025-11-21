const admin = require("../config/firebase-admin");

exports.sendWebNotification = async (req, res) => {
  const { title, body, token } = req.body;

  const message = {
    notification: { title, body },
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    return res.json({ success: true, response });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
