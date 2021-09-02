module.exports = async (Discord, interaction, axios, { get_role }) => {
    let get_emoji = interaction.options.getString("pin")
    await axios.patch('https://itgg.herokuapp.com/discord/table',{
      "discord_id" : interaction.member.id,
      "result" : get_emoji
    })
    .then(done => {
      interaction.reply("เข้าหลังบ้านสำเร็จเรียบร้อยแล้ว")
      interaction.member.send(`เปลี่ยนค่าเป็น ${get_emoji}`)
    })
    .catch(err => {
      interaction.reply("⚠️ มีบางอย่างไม่ถุกต้องไปเรียก GG-Admin มาดู ⚠️")
    })
  }