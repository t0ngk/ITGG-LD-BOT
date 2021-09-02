const sec_color = {
  nor: "#de4232",
  or: "#19b319",
  and: "#4680de",
  not: "#6c4187",
};
const sec_emoji = {
  and: "🐳",
  not: "👾",
  or: "🐸",
  nor: "🐦",
};
module.exports = async ({ MessageEmbed }, interaction, axios, { get_role }) => {
  await axios.get('https://itgg.herokuapp.com/')
    .then(res => {
      const get_gate = interaction.options.getString("gate")
      const sorted_leader = res.data.sort(function (a, b) { return parseFloat(b.coin) - parseFloat(a.coin); });
      const leaderboard = new MessageEmbed()
        .setColor(sec_color[sorted_leader[0].name])
        .setTitle('ตารางคะแนนแต่ละ Gate')
        .addFields(
          { name: `🏅 ${sorted_leader[0].name} : ${sorted_leader[0].coin} Token!`, value: "==============" },
          { name: `🥈 ${sorted_leader[1].name} : ${sorted_leader[1].coin} Token!`, value: "==============" },
          { name: `🥉 ${sorted_leader[2].name} : ${sorted_leader[2].coin} Token!`, value: "==============" },
          { name: `🐢 ${sorted_leader[3].name} : ${sorted_leader[3].coin} Token!`, value: "==============" },
        )
        .setTimestamp()
        .setFooter('🗨️🤖 : อัพเดจเมื่อ');


      if (get_gate != null) {
        sorted_leader.forEach(info => {
          if (info.name == get_gate) {
            const solo_lead = new MessageEmbed()
              .setColor(sec_color[get_gate])
              .setTitle(`ตารางคะแนน Gate ${info.name}`)
              .addFields(
                { name: `${sec_emoji[get_gate]} ${info.name} : ${info.coin} Token!`, value: "==============" },
              )
              .setTimestamp()
              .setFooter('🗨️🤖 : อัพเดจเมื่อ');
            interaction.reply({ embeds: [solo_lead] })
          }
        })
      } else {
        interaction.reply({ embeds: [leaderboard] });
      }
    })
    .catch(err => {
    })
}