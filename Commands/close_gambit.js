module.exports = async (Discord, interaction, axios, { get_role }) => {
    if (get_role(interaction)) {
      interaction.reply("กำลังสรุปผล")
      let get_result = []
      let get_fail = []
      let get_winner = []
      let winner = 0
      await axios.get(`https://itgg.herokuapp.com/discord/table/${interaction.member.id}`)
      .then(async done => {
        if (done.data == null) {
          interaction.channel.send("ไม่พบโต๊ะของคุณ")
          return
        }
        done.data.emoji.forEach(emoji_info => {
          if (emoji_info.icon == done.data.result) {
            emoji_info.member.forEach(user_id => {
              get_result.push({
                "discord_id" : user_id,
                "coin" : (done.data.bet * done.data.profit) - done.data.bet,
                "event" : `Gambit by ${interaction.member.displayName}`,
                "giver" : interaction.member.displayName
              })
              interaction.guild.members.cache.some(user_info => {
                if (user_info.id == user_id) {
                  get_winner.push(user_info)
                }
              })
              winner += 1
            })
          }else if (emoji_info.icon != done.data.result) {            
            emoji_info.member.forEach(user_id => {
              get_result.push({
                "discord_id" : user_id,
                "coin" : -done.data.bet,
                "event" : `Gambit by ${interaction.member.displayName}`,
                "giver" : interaction.member.displayName
              })
            })
          }
        })
        await axios.post('https://itgg.herokuapp.com/discord/coins', get_result)
        .then(async req => {
          const getres = req.data
          interaction.channel.send(`${done.data.result} Win! 🎉🎉🎉🎉🎉`)
          interaction.channel.send(`ยินดีด้วยกับ ${winner} คน ที่ได้รับ ${(done.data.bet * done.data.profit) - done.data.bet} Token! จาก __${"ระบบ Gambit"}__`)
          get_winner.forEach(user => {
            user.send(`ยินดีด้วยคุณชนะพนัน ได้รับ Token ทั้งหมด ${(done.data.bet * done.data.profit) - done.data.bet}`)
          })
          getres.fail.forEach((userid_fail) => {
            if (get_fail.findIndex(element => element == userid_fail) == -1) {
              interaction.channel.send(`🛑 <@${userid_fail}> คุณยังไม่ได้ยืนยันตัว กรุณายืนยันตัว(__**/auth**__) แล้วรีบแจ้ง GG Admin โดยด่วน🛑 `)
              get_fail.push(userid_fail)
            }
          })
          await axios.delete(`https://itgg.herokuapp.com/discord/table/${interaction.member.id}`)
          .then(done => {
            
          })
          .catch(err => {
            console.log(err)
          })
        })
        .catch((err) => {
          console.log(err)
          interaction.channel.send("⚠️ มีบางอย่างไม่ถุกต้องไปเรียก GG-Admin มาดู ⚠️")
        })
      })
      .catch(err => {
        console.log(err)
      })
    }else {
      interaction.reply("🗨️🤖 : อันนี้ของเล่นแอดมิน ไม่ให้ใช้หรอกอิอิ");
    }
  }