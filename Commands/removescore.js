module.exports = async (Discord, interaction, axios, { get_role }) => {
  if (get_role(interaction)) {
    const score = interaction.options.getInteger("score")
    const remove_syntax = /[<@!>]/g
    const remove_alhpa = /([^0123456789,])/g
    let member = interaction.options.getString("mention").replaceAll("><@!", ",").replaceAll(remove_syntax, "").replaceAll(remove_alhpa, "").split(",")
    let get_all = []
    let getcause = interaction.options.getString("cause")
    let getevent = interaction.options.getString("event")
    member.forEach((deq) => {
      if (!(interaction.guild.members.cache.some(userid => (userid.id == deq)))) {
        member = arrayremove(member, deq)
      }
    })
    member.forEach(user_id => {
      get_all.push({
        "discord_id" : user_id,
        "coin" : -score,
        "event" : String(getevent),
        "giver" : interaction.member.displayName
      })
    })
    await axios.post('https://itgg.herokuapp.com/discord/coins', get_all)
      .then((req) => {
        const getres = req.data
        if (getres.success.length > 1) {
          interaction.reply(`${getres.success.length} คน ถูกตัดคะแนน ${score} Token! เพราะว่า __${getcause}__`)
        } else if (getres.success.length == 1) {
          interaction.reply(`<@${getres.success}> ถูกตัดคะแนน ${score} Token! เพราะว่า __${getcause}__`)
        }
        else {
          interaction.reply("⚠️ ไม่พบผู้ใช้งานในระบบ ⚠️")
        }
        getres.fail.forEach((userid) => {
          interaction.channel.send(`🛑 <@${userid}> คุณยังไม่ได้ยืนยันตัว กณุณายืนยันตัว(__**/auth**__) แล้วรีบแจ้ง GG Admin โดยด่วน🛑 `)
        })
      })
      .catch((err) => {
        console.log(err)
      })
  } else {
    interaction.reply("🗨️🤖 : เห้ยอย่าแอบหักคะแนนเองสิ : (")
  }
}