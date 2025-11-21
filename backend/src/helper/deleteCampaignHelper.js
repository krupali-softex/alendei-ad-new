const axios = require("axios");

const deleteCampaign = async (id, token) => {
  await axios.delete(`https://graph.facebook.com/v21.0/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const deleteAdSet = async (id, token) => {
  await axios.delete(`https://graph.facebook.com/v21.0/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const deleteAdCreative = async (id, token) => {
  await axios.delete(`https://graph.facebook.com/v21.0/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const deleteAd = async (id, token) => {
  await axios.delete(`https://graph.facebook.com/v21.0/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
const deleteLeadForm = async (id, token) => {
  const response = await axios.delete(
    `https://graph.facebook.com/v21.0/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

module.exports = {
  deleteCampaign,
  deleteAdSet,
  deleteAd,
  deleteAdCreative,
  deleteLeadForm,
};