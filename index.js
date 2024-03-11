const express = require("express");
const { bot, MessageMedia } = require("./clientWApp.cjs");
const codeQR = require("qrcode");
const path = require("path");

// Config Express
const app = express();
app.use(express.static(path.join(__dirname)));

// Plungins

// Manejo de alertas
const alerts = {
  mensajeEnviado: "Mensaje enviado con exito!",
  mensajeNoEnviado: "Error al enviar mensaje!",
};

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

      // comandos
      if (msg.body === "!start") {
        msg.reply("Hi, soy Dexter, un chat bot.\nEstos son mis comandos: []");
      } else if (msg.body.includes("!sticker")) {
        if (msg.hasQuotedMsg) {
          const msgQuote = await msg.getQuotedMessage();
          const imgToSticker = await msgQuote.downloadMedia();
          await msg
            .reply(imgToSticker, msg.from, {
              sendMediaAsSticker: true,
              stickerName: "Dexter - Bot",
              stickerAuthor: "wa.me/+18094138873",
            })
            .then(() => console.log(alerts.mensajeEnviado))
            .catch((err) =>
              console.error(`${alerts.mensajeNoEnviado}: ${err}`)
            );
        } else {
          const imgToSticker = await msg.downloadMedia();

          await msg
            .reply(imgToSticker, msg.from, {
              sendMediaAsSticker: true,
              stickerName: "Dexter - Bot",
              stickerAuthor: "wa.me/+18094138873",
            })
            .then(() => console.log(alerts.mensajeEnviado))
            .catch((err) =>
              console.error(`${alerts.mensajeNoEnviado}: ${err}`)
            );
        }
      }
    })
    .on("group_join", async (msg) => {
      const member = msg.recipientIds[0];
      const chat = await msg.getChat();
      await chat.sendMessage(
        `Bienvenido/a @${member.replace("@c.us", "")} a ${chat.name}.\n\n${
          chat.description
        }`,
        {
          mentions: [member],
        }
      );
    })
    .initialize();
} catch (error) {
  console.error(error);
}

app.listen(3000, (port) => {
  console.log("escuchando el port 3000");
});
