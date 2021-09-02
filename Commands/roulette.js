module.exports = async (Discord, interaction, axios, { get_role }) => {
  if (get_role(interaction)) {      
    await interaction.reply("กำลังจัดโต๊ะสำหรับ Roulette")
    const get_countdown = interaction.options.getInteger("countdown")
    const get_point = interaction.options.getInteger("point")
    let mess = await interaction.channel.send(`✨ ตานี้ค่าลงเดิมพันคือ ${get_point} tokens ต่อสี ✨ 

ถ้าชนะสี  🔵 / 🔴  ตานี้จะได้ คะแนน ${get_point * 2} tokens
ถ้าชนะสี  🟢 ตานี้จะได้คะแนน ${get_point * 4} tokens`)
    mess.react("🔵")
    mess.react("🔴")
    mess.react("🟢")
    let all = []
    const roulette_filter = (reaction, user) => {
      return user.bot == false && reaction.message.id == mess.id;
    };
    const roulette_collector = mess.createReactionCollector({ roulette_filter, time: get_countdown * 1000 });

    roulette_collector.on("end",async collected => {
      let mutipie = {
        "blue" : -1,
        "red" : -1,
        "green" : -1
      }
      let rng = Math.floor(Math.random() * 100)
      if (rng > 0 && rng <= 45) {
        interaction.channel.send("Blue Win")
        mutipie.blue = 1
      }else if(rng > 45 && rng <= 90){
        interaction.channel.send("Red Win")
        mutipie.red = 1
      }else if(rng > 90){
        interaction.channel.send("Green Win")
        mutipie.green = 2
      }
      let winner = 0
      let blue = []
      let red = []
      let green = []
      collected.map(user => {user.users.cache.some(user_info => {
        if (!user_info.bot) {
          interaction.guild.members.cache.some(get_id => {
            if(get_id.id == user_info.id){
              if(user.emoji.name === '🔵'){
                all.push({
                  "discord_id" : get_id.id,
                  "coin" : (get_point * mutipie.blue),
                  "event" : "Roulette",
                  "giver" : interaction.member.displayName
                })
                blue.push(user_info)
              }
              if(user.emoji.name === '🔴'){
                all.push({
                  "discord_id" : get_id.id,
                  "coin" : (get_point * mutipie.red),
                  "event" : "Roulette",
                  "giver" : interaction.member.displayName
                })
                red.push(user_info)
              }
              if(user.emoji.name === '🟢'){
                all.push({
                  "discord_id" : get_id.id,
                  "coin" : (get_point * mutipie.green),
                  "event" : "Roulette",
                  "giver" : interaction.member.displayName
                })
                green.push(user_info)
              }
            }
          })
        }
      })})
      mess.reactions.removeAll()
      await axios.post("https://itgg.herokuapp.com/discord/coins",all)
      .then(done => {
        if (mutipie.blue > 0) {
          winner = blue.length
          blue.forEach(user => {
            user.send(`ยินดีด้วยคุณชนะพนัน ได้รับ Token ทั้งหมด ${get_point * mutipie.blue}`)
          })
        }else if(mutipie.red > 0){
          winner = red.length
          red.forEach(user => {
            user.send(`ยินดีด้วยคุณชนะพนัน ได้รับ Token ทั้งหมด ${get_point * mutipie.red}`)
          })
        }else if(mutipie.green > 0){
          winner = green.length
          green.forEach(user => {
            user.send(`ยินดีด้วยคุณชนะพนัน ได้รับ Token ทั้งหมด ${get_point * mutipie.green}`)
          })
        }
        interaction.channel.send(`ผู้ชนะทั้งหมด ${winner} คน`)
        done.data.fail.forEach(user => {
          interaction.channel.send(`🛑  <@${user}> คุณยังไม่ได้ยืนยันตัว กรุณายืนยันตัว(__**/auth**__) แล้วรีบแจ้ง GG Admin โดยด่วน  🛑`)
        })
      })
      .catch((err) => {
        interaction.channel.send("⚠️ มีบางอย่างไม่ถุกต้องไปเรียก GG-Admin มาดู ⚠️")
        console.log(err)
      })
    })
  } else {
    interaction.reply("🗨️🤖 : อันนี้ของเล่นแอดมิน ไม่ให้ใช้หรอกอิอิ")
  }
}