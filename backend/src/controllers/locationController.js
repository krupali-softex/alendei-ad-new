// controllers/locationController.js
const { Op } = require('sequelize');
const { City, State } = require('../models');

const autocompleteCities = async (req, res) => {
  try {
    const search = req.query.q?.toLowerCase();

    if (!search) {
      return res.status(400).json({ message: "Query too short" });
    }

    const results = await City.findAll({
      where: {
        name: {
          [Op.iLike]: `${search}%`, 
        },
      },
      include: [
        {
          model: State,
          attributes: ['name'],
        },
      ],
      limit: 10,
    });

    const formatted = results.map(city => ({
      city: city.name,
      state: city.State?.name || 'Unknown',
    }));
    const response = {
      message: "Cities found",
      data: formatted,
      success : true,
    }
    res.json(response);
  } catch (err) {
    console.error("Autocomplete error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { autocompleteCities };
