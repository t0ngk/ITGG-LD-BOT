module.exports = async (Discord, interaction, axios, { get_role }) => {
  if (get_role(interaction)) {
    const score = interaction.options.getInteger("score");
    const remove_syntax = /[<@!>]/g;
    const remove_alhpa = /([^0123456789,])/g;
    let member = interaction.options
      .getString("mention")
      .replaceAll("><@!", ",")
      .replaceAll(remove_syntax, "")
      .replaceAll(remove_alhpa, "")
      .split(",");
    let get_all = [];
    let getevent = interaction.options.getString("event");
    let getgiver = interaction.options.getString("giver");
    member.forEach((deq) => {
      if (!interaction.guild.members.cache.some((userid) => userid.id == deq)) {
        member = arrayremove(member, deq);
      }
    });
    member.forEach((user_id) => {
      get_all.push({
        discord_id: user_id,
        coin: score,
        event: getevent,
        giver: interaction.member.displayName,
      });
    });
    await axios
      .post("https://itgg.herokuapp.com/discord/coins", get_all)
      .then((req) => {
        const getres = req.data;
        if (getres.success.length > 1) {
          interaction.reply(
            `ยินดีด้วยกับ ${getres.success.length} คน ที่ได้รับ ${getres.coin} Token! จากกิจกรรม __${getevent}__`
          );
        } else if (getres.success.length == 1) {
          interaction.reply(
            `ยินดีด้วยกับ <@${getres.success}> ที่ได้รับ ${getres.coin} Token! จากกิจกรรม __${getevent}__`
          );
        } else {
          interaction.reply(
            "⚠️ ไม่พบผู้ใช้งานในระบบ หรือ ผู้ใช้อาจจะไม่ได้ยืนยันตัว รบกวนแอดมินแจ้งผู้ใช้ด้วยครับ ⚠️"
          );
        }
        getres.fail.forEach((userid) => {
          interaction.channel.send(
            `🛑 <@${userid}> คุณยังไม่ได้ยืนยันตัว กรุณายืนยันตัว(__**/auth**__) แล้วรีบแจ้ง GG Admin โดยด่วน🛑 `
          );
        });
      })
      .catch((err) => {
        interaction.channel.send(
          "⚠️ มีบางอย่างไม่ถุกต้องไปเรียก GG-Admin มาดู ⚠️"
        );
      });
  } else {
    interaction.reply("🗨️🤖 : เห้ยอย่าแอบเพิ่มคะแนนเองสิ : )");
  }
};
