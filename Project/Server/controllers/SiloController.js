// controllers/siloController.js
import Silo from "../models/SiloModel.js";

// --- GET all silos ---
export const getAllSilos = async (req, res) => {
  try {
    const silos = await Silo.find().sort({ createdAt: -1 });
    res.status(200).json(silos);
  } catch (err) {
    console.error("Error fetching silos:", err);
    res.status(500).json({ error: "Failed to fetch silos" });
  }
};

// --- POST add new silo ---
export const addSilo = async (req, res) => {
  try {
    const { name, area, code, capacity, manager, status, description } = req.body;

    if (!name || !area || !code || !capacity || !manager) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Prevent duplicate codes
    const existingSilo = await Silo.findOne({ code });
    if (existingSilo) {
      return res.status(400).json({ error: "Silo code already exists" });
    }

    const newSilo = await Silo.create({
      name,
      area,
      code,
      capacity,
      manager,
      status,
      description,
    });

    res.status(201).json(newSilo);
  } catch (err) {
    console.error("Error adding silo:", err);
    res.status(500).json({ error: "Failed to add silo" });
  }
};

// --- DELETE a silo ---
export const deleteSilo = async (req, res) => {
  try {
    const { id } = req.params;
    const silo = await Silo.findByIdAndDelete(id);
    if (!silo) {
      return res.status(404).json({ error: "Silo not found" });
    }
    res.status(200).json({ message: "Silo deleted successfully" });
  } catch (err) {
    console.error("Error deleting silo:", err);
    res.status(500).json({ error: "Failed to delete silo" });
  }
};


