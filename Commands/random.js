module.exports = async (Discord, interaction, axios, { get_role }) => {
  if (get_role(interaction)) {
    interaction.reply("เตรียมตัว ระวัง");
    const topic = interaction.options.getString("topic");
    const countdown = interaction.options.getInteger("countdown");
    let mess = await interaction.channel.send(`__**${topic}**__`);
    await mess.react("🎲");
    const filter = (reaction, user) => {
      return (
        reaction.emoji.name === "🎲" &&
        user.bot == false &&
        reaction.message.id == mess.id
      );
    };
    const collector = mess.createReactionCollector({
      filter,
      time: countdown * 1000,
    });

    collector.on("end", (collected) => {
      if (collected.size != 0) {
        mess.reply(`ผู้ชนะคือ <@${collector.users.random().id}> 🎉🎉🎉`);
      }
      mess.reactions.removeAll();
      mess.edit(`~~__**${topic}**__~~ ⚠️การสุ่มสิ้นสุดลงแล้ว⚠️`);
    });
  } else {
    interaction.reply("🗨️🤖 : อันนี้ของเล่นแอดมิน ไม่ให้ใช้หรอกอิอิ");
  }
};
