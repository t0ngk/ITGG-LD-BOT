module.exports = async (Discord, interaction, axios, { get_role }) => {
  let rng = Math.floor(Math.random() * 100)
  let score = 0
  if (rng > 0 && rng <= 15){
    score = 160
  }else if(rng > 15 && rng <= 50){
    score = 120
  }else if(rng > 50 && rng <= 70){
    score = 80
  }else if(rng > 70 && rng <= 90){
    score = 40
  }else if(rng > 90 && rng <= 100){
    score = 0
  }
  await axios.post('https://itgg.herokuapp.com/discord/coins',[
    {"discord_id" : interaction.member.id,"coin":score - 80}
  ])
  .then(done => {
    if (done.data.fail.length != 0){
      interaction.channel.send(`🛑  <@${done.data.fail}> คุณยังไม่ได้ยืนยันตัว กรุณายืนยันตัว(__**/auth**__) แล้วรีบแจ้ง GG Admin โดยด่วน  🛑`)
    }else{
      if (score - 80 > 0) {
        interaction.reply(`ยินดีด้วยคุณได้รับ ${score - 80} Token!  🎉🎉🎉🎉`)
      }else if(score - 80 == 0){
        interaction.reply(`แย่จังคุณได้คืนทุน`)
      }else{
        interaction.reply(`แย่จังคุณเสียไป ${score - 80} Token!`)
      }
    }
  })
  .catch(err => {
    interaction.channel.send("⚠️ มีบางอย่างไม่ถุกต้องไปเรียก GG-Admin มาดู ⚠️")
    console.log(err)
  })
}