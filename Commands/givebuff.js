module.exports = async (Discord, interaction, axios, { get_role }) => {
  if (get_role(interaction)) {
    const mention = interaction.options
      .getString("mention")
      .replaceAll("><@", ",")
      .replaceAll(/([^0123456789,])/g, "")
      .split(",");
    const buff = interaction.options.getString("buff");
    const duration = interaction.options.getInteger("duration") * 60;
    const payload = {
      discord_id: mention,
      name: buff,
      exp: duration,
    };
    await axios
      .post("https://itgg.herokuapp.com/discord/addBuff", payload)
      .then((done) => {
        if (mention.length == 1) {
          interaction.reply(
            `<@${mention[0]}> ได้รับ Buff __**${buff}**__ เป็นเวลา ${
              duration / 60
            } นาที  🎉🎉🎉🎉`
          );
        } else {
          interaction.reply(
            `${mention.length} คน ได้รับ Buff __**${buff}**__ เป็นเวลา ${
              duration / 60
            } นาที  🎉🎉🎉🎉`
          );
        }
      })
      .catch((err) => {
        interaction.reply("⚠️ มีบางอย่างไม่ถุกต้องไปเรียก GG-Admin มาดู ⚠️");
      });
  } else {
    interaction.reply("🗨️🤖 : อันนี้ของเล่นแอดมิน ไม่ให้ใช้หรอกอิอิ");
  }
};
