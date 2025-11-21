const express = require("express");
const { autocompleteCities } = require('../controllers/locationController');
const { authenticateToken } = require("../middlewares/authMiddleware");
const { fetchBackground } = require('../controllers/backgroundController');
const resolveLocations = require('../helper/fetchLocationsKeyHelper')



const router = express.Router();

router.get('/autocomplete',authenticateToken, autocompleteCities);

router.post("/fetch-background",authenticateToken, fetchBackground);

router.get("/fetch", resolveLocations);



module.exports = router;
