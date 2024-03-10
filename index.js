const express = require("express");
const { bot, MessageMedia } = require("./clientWApp.cjs");
const codeQR = require("qrcode");
const path = require("path");

// *************************
const app = express();
app.use(express.static(path.join(__dirname)));
// *************************

try {
  bot
    .on("qr", async (qr) => {
      await codeQR
        .toFile("./qr.png", qr, { type: "png", size: 200 })
        .then(() => console.log("qr listo"))
        .catch((err) => console.error(err));

      app.get("/qr", (req, res) => {
        res.sendFile(path.join(__dirname, "qr.png"));
      });
    })
    .on("ready", () => console.log("Client Conectado"))
    .on("message_create", async (msg) => {
      console.log(`${msg.from} ha enviado: ${msg.body}`);
    })
    .initialize();
} catch (error) {
  console.error(error);
}
