const express = require("express");
const { getAllSilos, addSilo, deleteSilo } = require("../controllers/SiloController");

const router = express.Router();

router.get("/", getAllSilos);
router.post("/", addSilo);
router.delete("/:id", deleteSilo);

module.exports = router;
