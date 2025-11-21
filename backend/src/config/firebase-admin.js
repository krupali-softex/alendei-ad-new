const admin = require("firebase-admin");
const serviceAccount = require("./alendei-adplatform-firebase-adminsdk-fbsvc-2c08f4533f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;