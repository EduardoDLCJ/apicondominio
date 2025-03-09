const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); // Importación correcta de mongoose
const fs = require("fs");
const path = require("path");

router.get("/", async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const backupData = {};

    for (let collection of collections) {
      const collectionName = collection.name;
      const data = await mongoose.connection.db.collection(collectionName).find().toArray();
      backupData[collectionName] = data;
    }

    const backupPath = path.join(__dirname, "backup.json");
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));

    res.download(backupPath, "backup.json", (err) => {
      if (err) console.error("Error al enviar el respaldo:", err);
      fs.unlinkSync(backupPath); // Eliminar el archivo después de la descarga
    });
  } catch (error) {
    console.error("Error al generar el respaldo:", error);
    res.status(500).json({ error: "Error al generar el respaldo" });
  }
});

module.exports = router; // Exportación correcta
