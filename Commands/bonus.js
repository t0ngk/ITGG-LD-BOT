module.exports = async (Discord, interaction, axios, { get_role }) => {
  if (get_role(interaction)) {
    const get_point = interaction.options.getInteger("point");
    const get_topic = interaction.options.getString("topic");
    const get_countdown = interaction.options.getInteger("countdown");
    await interaction.reply("เตรียมตัว ระวังงงงงง");
    await interaction.deleteReply();
    let mess = await interaction.channel.send(
      `⏲️🔥 แจก ${get_point} Token เป็น เวลา ${get_countdown} วิ เพราะ __**${get_topic}**__ กดเลย!!!!! หมดแล้วหมดเลย ระวังเสียใจภายหลัง 🔥⏲️`
    );
    mess.react("📌");
    const filter = (reaction, user) => {
      return (
        reaction.emoji.name === "📌" &&
        user.bot == false &&
        reaction.message.id == mess.id
      );
    };
    const collector = mess.createReactionCollector({
      filter,
      time: get_countdown * 1000,
    });

    collector.on("end", async (collected) => {
      let all_user = [];
      collected.map((info) => {
        info.users.cache.some((user) => {
          interaction.guild.members.cache.some((get_user) => {
            if (get_user.id == user.id && !user.bot) {
              all_user.push({
                discord_id: user.id,
                coin: get_point,
                event: get_topic,
                giver: interaction.member.displayName,
              });
            }
          });
        });
      });
      await axios
        .post("https://itgg.herokuapp.com/discord/coins", all_user)
        .then((done) => {
          mess.reactions.removeAll();
          mess.edit(
            `~~⏲️🔥 แจก ${get_point} Token เป็น เวลา ${get_countdown} วิ เพราะ __**${get_topic}**__ กดเลย!!!!! หมดแล้วหมดเลย ระวังเสียใจภายหลัง 🔥⏲️~~  ⚠️การแจกสิ้นสุดลงแล้ว⚠️`
          );
          done.data.fail.forEach((user) => {
            interaction.channel.send(
              `🛑  <@${user}> คุณยังไม่ได้ยืนยันตัว กรุณายืนยันตัว(__**/auth**__) แล้วรีบแจ้ง GG Admin โดยด่วน  🛑`
            );
          });
        })
        .catch((err) => {
          interaction.channel.send(
            "⚠️ มีบางอย่างไม่ถุกต้องไปเรียก GG-Admin มาดู ⚠️"
          );
        });
    });
  } else {
    interaction.reply("🗨️🤖 : อันนี้ของเล่นแอดมิน ไม่ให้ใช้หรอกอิอิ");
  }
};
