const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const app = express();
app.use(express.json());

const WHATSAPP_API_URL = "https://graph.facebook.com/v22.0/624284840757083/messages";
const ACCESS_TOKEN = "EAAQwSqTJekYBOZCyXSqaF92ttmozzbw7ZAK3dCAJ7aZBgb9aX8OnZCcqAlyu7sn964slUy4KGTQolSOZAssDswWwYpaVCxwF0Q2lLdtSwxwZBcnpXLRRfQV0ZBaWqhpbsDHonF6SKg5g8BnaTZBdO14ZBqWZCrKzKZBCZBKrIXd3OFXQYGw7xyZC1DTvcAg9t0ZBjWwdulOsV9XSK0wUUbP0MA68MHDZB7aixaD"; // Reemplázalo con tu token válido

router.post("/", async (req, res) => {
  try {
    const { numero } = req.body; // Número de WhatsApp recibido desde el frontend

    if (!numero) {
      return res.status(400).json({ error: "Número de teléfono requerido" });
    }

    const body = {
      messaging_product: "whatsapp",
      to: numero,
      type: "template",
      template: {
        name: "hello_world", // Reemplázalo con tu plantilla válida
        language: { code: "en_US" }
      }
    };

    const response = await fetch(WHATSAPP_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (response.ok) {
      res.json({ success: true, message: "Mensaje enviado", data });
    } else {
      res.status(response.status).json({ error: "Error al enviar mensaje", details: data });
    }
  } catch (error) {
    console.error("Error en la API:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;