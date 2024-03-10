const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");

const bot = new Client({
  authStrategy: new LocalAuth(),
});

module.exports = {
  bot,
  MessageMedia,
};
