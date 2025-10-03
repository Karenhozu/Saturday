const Status = require("../models/statusModel");

const getStatuses = async (req, res) => {
  try {
    const statuses = await Status.findAll();
    res.status(200).json(statuses);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener estados", error: error.message });
  }
};

module.exports = { getStatuses };
