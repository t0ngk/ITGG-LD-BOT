const Discord = require("discord.js");
const axios = require("axios");
const axiosInstance = axios.create({
  baseURL: "https://itgg.herokuapp.com",
});
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
  command("open_gambit", "./Commands/custom_gambit.js")
  command("cmode", "./Commands/cheatmode.js")
  command("close_gambit", "./Commands/close_gambit.js")

  function command(name, path) {
    if (interaction.commandName != name) return false;
    require(path)(Discord, interaction, axiosInstance, globalFunc);
  }
};
