const moment = require("moment");
moment.locale("th");
module.exports = async (Discord, interaction, axios, { get_role }) => {
  if (get_role(interaction)) {
    let mention = interaction.options.getMember("mention");
    await axios
      .get(`/discord/getBuff/${mention.id}`)
      .then((done) => {
        let all_buff = [];
        done.data.map((buff) => {
          all_buff.push({
            name: `__${buff.buff_name}__`,
            value: `${moment(buff.expireAt).fromNow()} จะหมดเวลา`,
          });
        });
        const embed = {
          type: "rich",
          title: `Check Buff`,
          description: "",
          color: 0x007bff,
          fields: all_buff,
          author: {
            name: `${mention.user.username}`,
            icon_url: `https://cdn.discordapp.com/avatars/${mention.user.id}/${mention.user.avatar}.png?size=128`,
          },
        };
        interaction.reply({ embeds: [embed] });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    interaction.reply("🗨️🤖 : อันนี้ของเล่นแอดมิน ไม่ให้ใช้หรอกอิอิ");
  }
};
