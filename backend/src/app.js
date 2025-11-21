const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const path = require('path');
const authRoutes = require("./routes/authRoutes");
const adCampaign = require("./routes/adcampaignRoutes");
const facebookRoutes = require("./routes/facebookRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const configureAWS = require("./config/awsConfig");
const themeRoutes = require("./routes/themeRoutes");
const workspaceRoutes = require('./routes/workspaceRoutes');
const billingDetailRoutes = require("./routes/billingdetailRoutes");
const generateImages = require("./routes/generateImageRoutes");
const uploadRoute = require('./routes/uploadRoute');
const notificationRoutes = require("./routes/notificationRoutes");
const locationRoutes = require("./routes/utilsRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const axios = require("axios");


dotenv.config();
configureAWS();

const app = express();
app.set("trust proxy", true);
app.use(cors('*'));

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ad", adCampaign);
app.use("/facebook", facebookRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api", themeRoutes);
app.use("/api", billingDetailRoutes);
app.use("/api", generateImages);
app.use('/workspace', workspaceRoutes);
app.use('/api', uploadRoute);
app.use("/api", notificationRoutes);
app.use("/api/background", locationRoutes);
app.use("/api", adminAuthRoutes);


app.use(express.static(path.join(__dirname, '..', 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

module.exports = app;

