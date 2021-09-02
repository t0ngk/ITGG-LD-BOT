module.exports = async (Discord, interaction, axios, { get_role }) => {
  let target = interaction.options.getMentionable("target")
  let targetid = ""
  if (target == null) { targetid = interaction.user.id } else { targetid = target.user.id }
  await axios.get(`https://itgg.herokuapp.com/players?search=${targetid}`)
    .then((res) => {
      const getres = res.data
      if (getres.length > 0) {
        if (targetid == interaction.user.id) {
          interaction.reply(`<@${targetid}> มีคะแนนทั้งหมด ${getres[0].coin} Token!`)
        } else {
          interaction.reply("ส่งให้ใน DM แล้วนะ 🕵️")
          setTimeout(() => {
            interaction.deleteReply()
          }, 2000);
          interaction.member.send(`<@${targetid}> มีคะแนนทั้งหมด ${getres[0].coin} Token!`)
        }
      } else {
        interaction.reply("⚠️ ไม่พบผู้ใช้งานในระบบ ⚠️")
      }
    })
    .catch((err) => {
    })
}