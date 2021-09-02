const { default: axios } = require("axios");
const { Client } = require("discord.js");

const client = new Client({
  intents: [
    "GUILDS",
    "GUILD_MESSAGES",
    "GUILD_VOICE_STATES",
    "GUILD_MESSAGE_REACTIONS",
  ],
});
const Interaction = require("./Interaction.js");

const list_commands = require("./Json/command-list.json");

client.once("ready", () => {
  console.log(`${client.user.username} Ready!`);
  client.user.setPresence({
    activities: [{ name: "ITGG LAST DAY" }],
    status: "online",
  });
});

client.on("message", (message) => {
  if (message.content == "!update") {
    mes_id = message.guild.id;
    list_commands.forEach((data) => {
      client.application?.commands.create(data, mes_id);
    });
    message.delete();
  }
});

client.on("interaction", Interaction);

client.login('ODc4OTk5NjAwMDA5MTgzMzAz.YSJWKw.axFg9E8buwrr3fcXgNiFJ5bl2lg');
