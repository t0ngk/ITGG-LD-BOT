const Discord = require("discord.js");
const axios = require("axios");
const globalFunc = require("./global_function.js");

module.exports = async (interaction) => {
  if (!interaction.isCommand()) return;

  command("auth", "./Commands/auth.js");
  command("random", "./Commands/random.js");
  command("bonus", "./Commands/bonus.js");
  command("givescore", "./Commands/givescore.js");
  command("removescore", "./Commands/removescore.js");
  command("score", "./Commands/score.js");
  command("unlink", "./Commands/unlink.js");
  command("gatescore", "./Commands/gateScore.js");
  command("roulette", "./Commands/roulette.js");
  command("wheelspin", "./Commands/wheelspin.js");
  command("givebuff", "./Commands/givebuff.js");
  command("checkbuff", "./Commands/checkbuff.js");

  function command(name, path) {
    if (interaction.commandName != name) return false;
    require(path)(Discord, interaction, axios, globalFunc);
  }
};
