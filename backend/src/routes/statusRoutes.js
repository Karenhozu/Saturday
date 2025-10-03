const express = require("express");
const { getStatuses } = require("../controllers/statusController");

const router = express.Router();

// Ruta para obtener todos los estados
router.get("/", getStatuses);

module.exports = router;
